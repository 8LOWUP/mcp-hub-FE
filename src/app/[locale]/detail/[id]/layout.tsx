// src/app/[locale]/detail/[id]/layout.tsx
"use client";

import QueryProvider from "@/providers/QueryProvider";
import LoginModal from "@/features/auth/components/LoginModal";
import { useLoginModalStore } from "@/store/login/login-modal-store";

export default function DetailLayout({ children }: { children: React.ReactNode }) {
    const { isOpen, close } = useLoginModalStore();

    return (
        <QueryProvider>
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
                    {children}
                    {/* ✅ 전역 로그인 모달 항상 렌더링 */}
                    <LoginModal isOpen={isOpen} onClose={close} />
                </div>
            </div>
        </QueryProvider>
    );
}


