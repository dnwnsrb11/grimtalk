import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import { LoadingComponents } from '@/components/common/LoadingComponents';
import Router from '@/routes';
import { useAuthStore } from '@/store/useAuthStore';

const queryClient = new QueryClient();

export default function App() {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // 애플리케이션이 처음 시작될 때(새로고침 포함)
  // localStorage 에 저장된 토큰을 조회하여 로그인 상태를 초기화(userData 복원)
  // 사용자가 로그인 후 브라우저를 닫았다가 다시 열어도 토큰이 유효하다면 자동으로 로그인 상태 유지
  useEffect(() => {
    useAuthStore.getState().initializeAuth(); // 앱 시작 시 토큰 조회 후 로그인 상태 초기화
  }, []);

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
