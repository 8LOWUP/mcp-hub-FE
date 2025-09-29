// src/components/layout/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/searchBar";
import LoginModal from "@/features/auth/components/LoginModal";
import { useLoginStore } from "@/store/login/login-store";
import { socialLogin } from "@/services/auth/social-login";

/* 경로 끝 슬래시 정규화 */
const trimSlash = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);

const Header: React.FC = () => {
    const router = useRouter();
    const pathnameRaw = usePathname() || "/";
    const pathname = trimSlash(pathnameRaw);

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

    // 로그인 모달 상태
    const [isLoginOpen, setIsLoginOpen] = React.useState(false);
    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    // 공통 이동
    const go = (to: string) => router.push(to);

    /* ================================
     * 프로필/로그인 버튼 클릭 동작
     * - 랜딩(/[locale])에서는 로그인 모달 오픈 (비로그인 시)
     * - 그 외 페이지에서는 profiles로 이동
     * - 이미 로그인된 상태라면 언제나 profiles로 이동
     * ================================ */
    const handleProfileOrLoginClick = () => {
        if (isAuthed) {
            go(`/${locale}/profiles`);
            return;
        }
        if (isLocaleHome) {
            openLogin();
        } else {
            go(`/${locale}/profiles`);
        }
    };

    return (
        <header className="sticky top-0 z-40 shadow-md">
            <div
                className={[
                    "absolute top-0 left-0 right-0 z-20 h-20 px-10 bg-surface-1 transition-colors duration-200",
                    scrolled ? "border-b-2 border-accent" : "border-b border-transparent",
                ].join(" ")}
            >
                <div className="max-w-screen-2xl h-full flex items-center justify-between px-6">
                    {/* 로고 + Market */}
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="MCP Hub logo" width={24} height={24} priority />
                        <button
                            type="button"
                            className="flex flex-col cursor-pointer"
                            onClick={() => go(`/${locale}`)}
                        >
              <span className="text-primary font-bold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                MCP Hub
              </span>
                        </button>

                        <button
                            type="button"
                            className="cursor-pointer px-4 py-2 rounded-md flex items-center justify-center relative"
                            onClick={() => go(`/${locale}/market`)}
                        >
              <span className="hidden md:flex text-primary font-semibold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                MCP Market
              </span>
                        </button>
                    </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-xl px-4">
            <SearchBar />
          </div>
                    {/* 우측 액션 */}
                    <div className="flex items-center gap-x-3">
                        <PrimaryButton
                            onClick={() => go(`/${locale}/upload`)}
                            variant="primary"
                            size="md"
                            className="hidden md:flex h-9 px-15"
                        >
                            <span className="text-title5">Upload</span>
                        </PrimaryButton>
                        <ThemeToggle />
                        <LocaleSwitcher />

                        {/* 로그인 전: Log In / 로그인 후: 아바타 */}
                        {isAuthed ? (
                            <div className="flex items-center gap-2">
                                {/* 사용자 정보 표시 (우리 로그인 스토어에서) */}
                                {user && (
                                    <span className="hidden md:block text-sm text-primary">
                                        {user.name}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleProfileOrLoginClick}
                                    aria-label="Open profile"
                                    className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <Image
                                        src={user?.profileImage || "/catprofile.svg"}
                                        alt={user?.name || "Profile"}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                                {/* 로그아웃 버튼 */}
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
                                className="h-9 px-4"
                            >
                                Log In
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
