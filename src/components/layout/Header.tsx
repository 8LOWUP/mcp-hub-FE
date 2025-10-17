// src/components/layout/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
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
    console.log("🔍 Header 컴포넌트 렌더링됨");
    const router = useRouter();
    const pathnameRaw = usePathname() || "/";
    const pathname = trimSlash(pathnameRaw);
    
    // Locale translations
    const t = useTranslations('Header');

    // 세션 (로그인 여부) - NextAuth와 우리 로그인 스토어 둘 다 확인
    const { status } = useSession();
    const { isLoggedIn, user } = useLoginStore();
    const isAuthed = status === "authenticated" || isLoggedIn;

    // locale 추출 (URL의 첫 세그먼트)
    const locale = React.useMemo(() => pathname.split("/")[1] || "en", [pathname]);

    // 현재 페이지가 locale 루트인지 (예: /ko)
    const isLocaleHome = React.useMemo(() => pathname === `/${locale}`, [pathname, locale]);

    // 헤더 스크롤 스타일
    const [scrolled, setScrolled] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 로그인 모달 상태(로컬 관리)
    const [isLoginOpen, setIsLoginOpen] = React.useState(false);
    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    // 공통 이동
    const go = (to: string) => router.push(to);

    /* ================================
     * 프로필/로그인 버튼 클릭 동작
     * - 로그인된 상태라면 언제나 profiles로 이동
     * - 비로그인 상태라면 언제나 로그인 모달 오픈
     * ================================ */
    const handleProfileOrLoginClick = () => {
        if (isAuthed) {
            go(`/${locale}/profiles`);
            return;
        }
        // 비로그인 상태라면 로그인 모달 오픈
        openLogin();
    };

    return (
        <header className="sticky top-0 z-50 shadow-md">
            <div
                className={[
                    "absolute top-0 left-0 right-0 z-50 h-20 px-5 bg-surface-1 transition-colors duration-200",
                    scrolled ? "border-b-2 border-accent" : "border-b border-transparent",
                ].join(" ")}
            >
                <div className="max-w-screen-2xl h-full flex items-center justify-between">
                    {/* 로고 + Market */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="flex gap-2 cursor-pointer"
                            onClick={() => go(`/${locale}`)}
                        >
                            <Image 
                                src="/logo.svg" 
                                alt="MCP Hub logo" 
                                width={35} 
                                height={35} 
                                priority 
                                loader={imageLoader}
                                unoptimized
                            />
                            <div className="justify-center items-center text-primary hidden md:flex font-bold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                                {"MCP Hub"}
                            </div>
                        </button>

                        <button
                            type="button"
                            className="cursor-pointer rounded-md md:flex items-center justify-center relative hidden"
                            onClick={() => go(`/${locale}/market`)}
                        >
              <span className="hidden md:flex text-primary font-semibold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                {t('market')}
              </span>
                        </button>
                    </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-xl px-4">
            <ClientSearchBar />
          </div>
                    {/* 우측 액션 */}
                    <div className="flex items-center gap-x-2">
                        <PrimaryButton
                            onClick={() => go(`/${locale}/upload`)}
                            variant="primary"
                            size="md"
                        >
                            <span className="text-title5">{t('upload')}</span>
                        </PrimaryButton>
                        <ThemeToggle />
                        <LocaleSwitcher />

                        {/* 로그인 전: Log In / 로그인 후: 아바타 */}
                        {isAuthed ? (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleProfileOrLoginClick}
                                    aria-label="Open profile"
                                    className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
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
                                {/* 로그아웃 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => socialLogin.logout()}
                                    className="hidden md:block text-xs text-muted hover:text-primary transition-colors"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        ) : (
                            <PrimaryButton
                                onClick={handleProfileOrLoginClick}
                                variant="secondary"
                                size="sm"
                                additionalClassName="py-2 px-2"
                            >
                                {t('login')}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </div>

            {/* 랜딩에서만 열리는 로그인 모달 (isLocaleHome인 경우에만 실제로 트리거됨) */}
            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </header>
    );
};

export default Header;
