"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function UploadLayout({ children }: { children: ReactNode }) {
    // ✅ QueryClient는 한 번만 생성되도록 useState 사용
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
            </div>

            {/* ✅ 개발 편의를 위한 React Query Devtools (선택) */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
