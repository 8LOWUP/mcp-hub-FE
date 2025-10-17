// src/components/layout/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import imageLoader from "@/lib/imageLoader";

import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ClientSearchBar from "@/components/ui/ClientSearchBar";
import LoginModal from "@/features/auth/components/LoginModal";
import { useLoginStore } from "@/store/login/login-store";
import { socialLogin } from "@/services/auth/social-login";

/* 경로 끝 슬래시 정규화 */
const trimSlash = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);

const Header: React.FC = () => {
    const router = useRouter();
    const pathnameRaw = usePathname() || "/";
    const pathname = trimSlash(pathnameRaw);

    // 세션 (로그인 여부)
    const { status } = useSession();
    const { isLoggedIn, user } = useLoginStore();
    const isAuthed = status === "authenticated" || isLoggedIn;

    // locale
    const locale = React.useMemo(() => pathname.split("/")[1] || "en", [pathname]);
    const isLocaleHome = React.useMemo(() => pathname === `/${locale}`, [pathname, locale]);

    // 스크롤 상태 -> 0px 초과일 때만 유리효과 + 경계선/섀도우
    const [scrolled, setScrolled] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 로그인 모달
    const [isLoginOpen, setIsLoginOpen] = React.useState(false);
    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const go = (to: string) => router.push(to);

    const handleProfileOrLoginClick = () => {
        if (isAuthed) {
            go(`/${locale}/profiles`);
            return;
        }
        openLogin();
    };

    return (
        <header
            className={[
                "sticky top-0 z-50 transition-all duration-300",
                // 기본은 배경/경계 표시 최소화 → 히어로와 자연스럽게 이어짐
                scrolled
                    ? [
                        // ✅ 스크롤되면 유리 효과 + 반투명 배경 + 경계선 + 살짝 섀도우
                        "backdrop-blur-md supports-[backdrop-filter]:bg-surface-1/70",
                        "bg-surface-1/85",
                        "border-b border-black/10 dark:border-white/10 shadow-sm",
                    ].join(" ")
                    : [
                        // ✅ 최상단에서는 배경/경계 거의 투명 → 메인과 블렌딩
                        "supports-[backdrop-filter]:backdrop-blur-sm",
                        "bg-transparent",
                        "border-b border-transparent",
                    ].join(" "),
            ].join(" ")}
            aria-label="Global header"
        >
            {/* 상단 헤더 콘텐츠 */}
            <div className="max-w-screen-2xl mx-auto h-20 flex items-center justify-between px-6 lg:px-10">
                {/* 로고 + Market */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="MCP Hub logo"
                        width={24}
                        height={24}
                        priority
                        loader={imageLoader}
                        unoptimized
                        className="icon-tone"
                    />
                    <button
                        type="button"
                        className="flex flex-col cursor-pointer"
                        onClick={() => go(`/${locale}`)}
                    >
            <span className="text-primary font-bold hover:text-accent transition-colors">
              MCP Hub
            </span>
                    </button>

                    <button
                        type="button"
                        className="cursor-pointer px-4 py-2 rounded-md flex items-center justify-center relative hover:bg-surface-3 active:bg-surface-4 transition-colors"
                        onClick={() => go(`/${locale}/market`)}
                    >
            <span className="hidden md:flex text-secondary font-semibold hover:text-accent transition-colors">
              MCP Market
            </span>
                    </button>
                </div>

                {/* 검색바 */}
                <div className="flex-1 max-w-xl px-4">
                    <ClientSearchBar />
                </div>

                {/* 우측 액션 */}
                <div className="flex items-center gap-x-2">
                    {/* Upload 버튼 */}
                    <PrimaryButton
                        onClick={() => go(`/${locale}/upload`)}
                        variant="primary"
                        size="md"
                    >
                        <span className="text-title5">Upload</span>
                    </PrimaryButton>

                    {/* ✅ Theme + Locale 버튼 묶음 (간격 축소 + 크기 미세 조정) */}
                    <div className="flex items-center gap-x-1">
                        <div className="icon-tone-wrap p-1.5 rounded-md hover:bg-surface-3 active:bg-surface-4 transition-colors">
                            <ThemeToggle />
                        </div>
                        <div className="icon-tone-wrap p-1.5 rounded-md hover:bg-surface-3 active:bg-surface-4 transition-colors">
                            <LocaleSwitcher />
                        </div>
                    </div>

                    {/* 로그인 상태에 따라 표시 */}
                    {isAuthed ? (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleProfileOrLoginClick}
                                aria-label="Open profile"
                                className="w-11 h-11 mx-1 rounded-full border border-contrast overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color-1)] cursor-pointer bg-surface-2"
                            >
                                <Image
                                    src={user?.avatarUrl || "/catprofile.svg"}
                                    alt={user?.nickname || "Profile"}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                    loader={imageLoader}
                                    unoptimized
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => socialLogin.logout()}
                                className="hidden md:block text-xs text-muted hover:text-primary transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <PrimaryButton
                            onClick={handleProfileOrLoginClick}
                            variant="secondary"
                            size="sm"
                            additionalClassName="py-2 px-2"
                        >
                            Log In
                        </PrimaryButton>
                    )}
                </div>

            </div>

            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </header>
    );
};

export default Header;
