import { QueryClientProvider } from '@tanstack/react-query';

import { LoadingComponents } from '@/components/common/LoadingComponents';
import { useAuthInitialize } from '@/hooks/useAuthInitialize';
import { useNotificationSubscription } from '@/hooks/useNotificationSubscription';
import { queryClient } from '@/lib/queryClient';
import Router from '@/routes';
import { useAuthStore } from '@/store/useAuthStore';

export default function App() {
  const isInitialized = useAuthInitialize();
  const isLogin = useAuthStore((state) => state.isLogin);

  useNotificationSubscription(isLogin);

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
