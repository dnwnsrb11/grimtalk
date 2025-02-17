import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { toast } from 'react-hot-toast';

import { _axiosAuth } from '@/api/instance';
import { useAuthStore } from '@/store/useAuthStore';

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

  // 이미 연결이 존재하거나 로그인하지 않은 경우 구독하지 않음
  if (!isLogin || !accessToken || NotificationEventSource.getInstance()) return;

  // 로그인 상태 변경 감지를 위한 구독 설정
  const unsubscribeAuth = useAuthStore.subscribe(
    (state) => [state.isLogin],
    ([currentIsLogin]) => {
      if (!currentIsLogin) {
        NotificationEventSource.closeConnection();
      }
    },
    { fireImmediately: false },
  );

  try {
    // EventSourcePolyfill을 사용하여 SSE 연결 생성
    const newEventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_API_BASE_URL}/sse/notification/subscribe`,
      {
        headers: {
          'X-Access-Token': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );

    // 새로운 알림 수신 시 이벤트 핸들러
    newEventSource.addEventListener('notification', (event) => {
      const notification = JSON.parse(event.data);
      // 토스트 메시지로 알림 표시 (커스텀 알림 아이콘 사용)
      toast(notification.message, {
        icon: '🔔',
        position: 'top-right',
      });
      // 알림 목록 갱신
      queryClient.invalidateQueries(['notifications']);
    });

    // 에러 발생 시 처리 및 재연결 로직
    newEventSource.onerror = (error) => {
      // 1초 후 재연결 시도
      setTimeout(() => {
        if (!NotificationEventSource.getInstance()) {
          subscribeToNotifications();
        }
      }, 1000);
      console.error('SSE Error:', error);
    };

    // 연결 상태 모니터링을 위한 변수와 상수 선언
    const HEARTBEAT_TIMEOUT = 45000; // 45초
    const HEARTBEAT_CHECK_INTERVAL = 15000; // 15초
    let lastHeartbeatTime = Date.now();

    newEventSource.addEventListener('ping', (event) => {
      lastHeartbeatTime = Date.now();
    });

    // 연결 상태 모니터링
    const heartbeatInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastHeartbeatTime > HEARTBEAT_TIMEOUT) {
        clearInterval(heartbeatInterval);
        NotificationEventSource.closeConnection();
        subscribeToNotifications(); // 재연결
      }
    }, HEARTBEAT_CHECK_INTERVAL);

    // 연결 종료 시 heartbeat 인터벌 정리
    newEventSource.addEventListener('close', () => {
      clearInterval(heartbeatInterval);
    });

    NotificationEventSource.setInstance(newEventSource);
  } catch (error) {
    console.error('SSE Connection Error:', error);
    NotificationEventSource.closeConnection();
  }

  // 구독 해제 함수 반환
  return () => {
    unsubscribeAuth();
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
