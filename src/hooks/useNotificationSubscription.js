import { useEffect } from 'react';

import { subscribeToNotifications, unsubscribeFromNotifications } from '@/api/notification';

// 로그인 상태 변경 시 SSE 구독 처리
// SSE(Server-Sent Events)는 서버에서 클라이언트로 실시간 데이터를 보내는 단방향 통신 방식
// 웹소켓과 달리 서버->클라이언트 단방향 통신만 가능하지만, 구현이 간단하고 자동 재연결을 지원
export function useNotificationSubscription(isLogin) {
  useEffect(() => {
    if (isLogin) {
      const unsubscribe = subscribeToNotifications();
      return () => {
        unsubscribe?.();
        unsubscribeFromNotifications();
      };
    }
  }, [isLogin]);
}
