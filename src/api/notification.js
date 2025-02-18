import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { _axiosAuth } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

// 알림 상태 관리를 위한 store 생성
export const useNotificationStore = create((set) => ({
  lastNotification: null,
  setLastNotification: (notification) => set({ lastNotification: notification }),
}));

// SSE 연결 관리를 위한 클래스
class NotificationEventSource {
  static instance = null;

  static getInstance() {
    return this.instance;
  }

  static setInstance(newInstance) {
    this.instance = newInstance;
  }

  static closeConnection() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }
}

// SSE 구독 설정 함수
const subscribeToNotifications = () => {
  const { isLogin } = useAuthStore.getState();
  const accessToken = localStorage.getItem('accessToken');
  const queryClient = new QueryClient();

  if (!isLogin || !accessToken || NotificationEventSource.getInstance()) return;

  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  try {
    const newEventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_API_BASE_URL}/sse/notification/subscribe`,
      {
        headers: {
          'X-Access-Token': `Bearer ${accessToken}`,
          Accept: 'text/event-stream',
        },
        withCredentials: true,
        heartbeatTimeout: 45000,
      },
    );

    // 연결 시작 시 로그
    newEventSource.onopen = () => {
      console.log('SSE 연결이 성공적으로 설정되었습니다.');
      reconnectAttempts = 0; // 연결 성공시 재시도 카운트 초기화
    };

    const reconnectSSE = () => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('최대 재연결 시도 횟수를 초과했습니다.');
        NotificationEventSource.closeConnection();
        return;
      }

      NotificationEventSource.closeConnection();
      reconnectAttempts++;

      console.log(
        `${reconnectAttempts}번째 재연결 시도... ${RECONNECT_DELAY / 1000}초 후 시도합니다.`,
      );

      setTimeout(() => {
        if (!NotificationEventSource.getInstance()) {
          subscribeToNotifications();
        }
      }, RECONNECT_DELAY);
    };

    // 에러 처리
    newEventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);

      if (newEventSource.readyState === EventSource.CLOSED) {
        reconnectSSE();
      }
    };

    // 알림 이벤트 처리
    newEventSource.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        useNotificationStore.getState().setLastNotification(notification);

        // 토스트 메시지 표시 전에 기존 토스트 제거
        toast.dismiss();
        toast(notification.message, {
          icon: '🔔',
          position: 'top-right',
          duration: 5000,
        });

        queryClient.invalidateQueries(['notifications']);
      } catch (error) {
        console.error('알림 처리 중 오류 발생:', error);
      }
    });

    NotificationEventSource.setInstance(newEventSource);
  } catch (error) {
    console.error('SSE 초기 연결 실패:', error);
    reconnectSSE();
  }

  return () => {
    NotificationEventSource.closeConnection();
  };
};

// 알림 목록 조회 훅
const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/sse/notification');
      return data.body.data;
    },
  });
};

// 단일 알림 읽음 처리 훅
const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await _axiosAuth.patch(`/sse/notification/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });
};

// 전체 알림 읽음 처리 훅
const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await _axiosAuth.patch('/sse/notification/read-all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });
};

// SSE 연결 수동 해제 함수
const unsubscribeFromNotifications = () => {
  NotificationEventSource.closeConnection();
};

export {
  subscribeToNotifications,
  unsubscribeFromNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
};
