"use client";

import { useLoginStore } from "@/store/login/login-store";

export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
    const isLoggedIn = useLoginStore((s) => s.isLoggedIn);

    // 미들웨어에서 이미 인증 확인을 했으므로, 여기서는 단순히 로그인 상태만 확인
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        로그인이 필요합니다
                    </h1>
                    <p className="text-muted-foreground">
                        이 페이지에 접근하려면 로그인해주세요.
                    </p>
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
}
