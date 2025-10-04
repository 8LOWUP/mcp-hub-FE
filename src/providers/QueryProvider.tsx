"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
    // ✅ QueryClient는 반드시 클라이언트 컴포넌트에서 useState로 생성해야 함
    const [client] = useState(() => new QueryClient());

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
