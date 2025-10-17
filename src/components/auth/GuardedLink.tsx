"use client";

/* 헤더/카드에서 보호 링크 클릭 시: 기본 동작 차단 + 토스트 + 모달/리다이렉트 */
import React, { MouseEvent } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { stripLocale, withLocale, LOGIN_BASE_PATH } from "@/constants/routes";
import { useLoginModalStore } from "@/store/login/login-modal-store";

export type GuardedLinkProps = LinkProps & {
    children: React.ReactNode;
    requiresAuth?: boolean;
    className?: string;
};

const GuardedLink: React.FC<GuardedLinkProps> = ({
                                                     requiresAuth = false,
                                                     children,
                                                     href,
                                                     className,
                                                     ...rest
                                                 }) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!requiresAuth || isLoggedIn) return;

        e.preventDefault();
        toast.warning("로그인이 필요한 기능입니다.");

        const open = useLoginModalStore.getState().open;
        if (open) {
            open();
            return;
        }

        const targetPath = typeof href === "string" ? href : String((href as any).pathname || "/");
        const { locale } = stripLocale(targetPath);
        const nextParam = encodeURIComponent(targetPath);
        const loginUrl = `${withLocale(LOGIN_BASE_PATH, locale)}?next=${nextParam}&authRequired=1`;
        router.push(loginUrl);
    };

    return (
        <Link href={href} onClick={handleClick} className={className} {...rest}>
            {children}
        </Link>
    );
};

export default GuardedLink;
