"use client";

/* 보호 페이지에서 래핑해 사용: 비로그인 시 토스트 + 모달 또는 로그인 리다이렉트 */
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { stripLocale, withLocale, LOGIN_BASE_PATH } from "@/constants/routes";
import { useLoginModalStore } from "@/store/login/login-modal-store";

export type RequireAuthProps = {
    children: React.ReactNode;
    onDeny?: "redirect" | "modal";
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children, onDeny = "modal" }) => {
    const { isLoggedIn } = useAuth();
    const pathname = usePathname(); // 예: "/ko/chat"
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) return;

        const { locale } = stripLocale(pathname);
        toast.warning("로그인이 필요한 기능입니다.");

        if (onDeny === "modal" && useLoginModalStore.getState().open) {
            useLoginModalStore.getState().open();
            return;
        }

        const nextParam = encodeURIComponent(pathname + window.location.search);
        const loginUrl = `${withLocale(LOGIN_BASE_PATH, locale)}?next=${nextParam}&authRequired=1`;
        router.replace(loginUrl);
    }, [isLoggedIn, pathname, router, onDeny]);

    if (!isLoggedIn) return null;
    return <>{children}</>;
};

export default RequireAuth;
