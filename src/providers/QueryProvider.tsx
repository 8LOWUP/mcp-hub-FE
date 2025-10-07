"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 캐시 유지
            staleTime: 5 * 60 * 1000,
            // 10분간 가비지 컬렉션 방지
            gcTime: 10 * 60 * 1000,
            // 에러 시 재시도 횟수
            retry: 1,
            // 백그라운드에서 자동 새로고침 비활성화
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 에러 시 재시도 횟수
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
