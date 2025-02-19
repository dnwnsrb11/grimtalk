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
  const MAX_RECONNECT_ATTEMPTS = 999999; // 실질적으로 무한 재시도
  const INITIAL_RECONNECT_DELAY = 1000;
  const MAX_RECONNECT_DELAY = 30000;
  let currentReconnectDelay = INITIAL_RECONNECT_DELAY;

  const connect = () => {
    try {
      const newEventSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_API_BASE_URL}/sse/notification/subscribe`,
        {
          headers: {
            'X-Access-Token': `Bearer ${accessToken}`,
            Accept: 'text/event-stream',
          },
          withCredentials: true,
          heartbeatTimeout: 120000, // 하트비트 타임아웃을 2분으로 증가
        },
      );

      newEventSource.onopen = () => {
        reconnectAttempts = 0;
        currentReconnectDelay = INITIAL_RECONNECT_DELAY;
      };

      const reconnectSSE = () => {
        NotificationEventSource.closeConnection();
        reconnectAttempts++;

        // 지수 백오프로 재연결 딜레이 증가
        currentReconnectDelay = Math.min(currentReconnectDelay * 1.5, MAX_RECONNECT_DELAY);

        setTimeout(() => {
          if (!NotificationEventSource.getInstance()) {
            connect();
          }
        }, currentReconnectDelay);
      };

      // 주기적으로 연결 상태 체크
      const connectionCheck = setInterval(() => {
        if (newEventSource.readyState === EventSource.CLOSED) {
          clearInterval(connectionCheck);
          reconnectSSE();
        }
      }, 5000);

      newEventSource.onerror = (error) => {
        clearInterval(connectionCheck);

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
        } catch {
          return null;
        }
      });

      NotificationEventSource.setInstance(newEventSource);
    } catch (error) {
      setTimeout(connect, currentReconnectDelay);
    }
  };

  connect();

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
