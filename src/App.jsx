import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import { LoadingComponents } from '@/components/common/LoadingComponents';
import { useAuthInitialize } from '@/hooks/useAuthInitialize';
import { queryClient } from '@/lib/queryClient';
import Router from '@/routes';
import { useAuthStore } from '@/store/useAuthStore';

export default function App() {
  const isInitialized = useAuthInitialize();

  const isLogin = useAuthStore((state) => state.isLogin);

  // 로그인 상태 변경 시 SSE 구독 처리
  // SSE(Server-Sent Events)는 서버에서 클라이언트로 실시간 데이터를 보내는 단방향 통신 방식
  // 웹소켓과 달리 서버->클라이언트 단방향 통신만 가능하지만, 구현이 간단하고 자동 재연결을 지원
  useEffect(() => {
    if (isLogin) {
      // 로그인 시 SSE 연결 시작
      const unsubscribe = subscribeToNotifications();
      return () => {
        // 컴포넌트 언마운트 또는 로그아웃 시 SSE 연결 정리
        unsubscribe?.();
        unsubscribeFromNotifications();
      };
    }
  }, [isLogin]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* 초기화가 완료되지 않았다면 로딩 상태를 보여줌 */}
      {/* 깜빡임 현상(Flash of Unauthorized Content, FOUC) 방지 */}
      {!isInitialized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
          <LoadingComponents />
        </div>
      )}
    </QueryClientProvider>
  );
}
