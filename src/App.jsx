import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import Router from '@/routes';
import { useAuthStore } from '@/store/useAuthStore';

const queryClient = new QueryClient();

export default function App() {
  // 애플리케이션이 처음 시작될 때(새로고침 포함)
  // localStorage 에 저장된 토큰을 조회하여 로그인 상태를 초기화(userData 복원)
  // 사용자가 로그인 후 브라우저를 닫았다가 다시 열어도 토큰이 유효하다면 자동으로 로그인 상태 유지
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
