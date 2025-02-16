import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 1회 재시도
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});
