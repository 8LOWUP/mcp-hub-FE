// src/components/layout/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
// import { useSession } from "next-auth/react"; // 커스텀 로그인 시스템 사용
import { useTranslations } from "next-intl";
import imageLoader from "@/lib/imageLoader";

import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ClientSearchBar from "@/components/ui/ClientSearchBar";
import LoginModal from "@/features/auth/components/LoginModal";
import { useLoginStore } from "@/store/login/login-store";
import { socialLogin } from "@/services/auth/social-login";
import { IoIosBasket } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";

/* 경로 끝 슬래시 정규화 */
const trimSlash = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);

const Header: React.FC = () => {
    const router = useRouter();
    const pathnameRaw = usePathname() || "/";
    const pathname = trimSlash(pathnameRaw);

    // Locale translations
    const t = useTranslations('Header');

    // 로그인 상태 (커스텀 로그인 시스템 사용)
    const { isLoggedIn, user } = useLoginStore();
    const isAuthed = isLoggedIn;

    // locale
    const locale = React.useMemo(() => pathname.split("/")[1] || "en", [pathname]);

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
            <div
                className={[
                    "absolute top-0 left-0 right-0 z-50 h-20 px-5 bg-surface-1 transition-colors duration-200",
                    scrolled ? "border-b-2 border-accent" : "border-b border-transparent",
                ].join(" ")}
            >
                <div className="max-w-screen h-full flex items-center justify-between">
                    {/* 로고 + Market */}
                    <div className="flex items-center gap-1 md:gap-2">
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
                                className="icon-tone"
                            />
                            <div className="justify-center items-center text-primary hidden md:flex font-bold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                                {"MCP Hub"}
                            </div>
                        </button>

                        {/* Market 버튼 - sm 이하에서는 아이콘, sm 이상에서는 텍스트 */}
                        <button
                            type="button"
                            className="cursor-pointer rounded-md flex items-center justify-center relative p-2 bg-surface-2 sm:!bg-transparent hover:bg-surface-2 transition-colors"
                            onClick={() => go(`/${locale}/market`)}
                            aria-label={t('market')}
                        >
                            {/* sm 이하: 아이콘만 표시 */}
                            <IoIosBasket className="w-6 h-6 text-primary sm:hidden" />
                            {/* sm 이상: 텍스트 표시 */}
                            <span className="hidden sm:flex text-primary font-semibold hover:decoration-accent hover:underline decoration-yellow-200 underline-offset-10">
                                {t('market')}
                            </span>
                        </button>
                    </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-3xl px-2">
            <ClientSearchBar />
          </div>
                    {/* 우측 액션 */}
                    <div className="flex items-center gap-x-2">
                        {/* Upload 버튼 - sm 이하에서는 아이콘, sm 이상에서는 텍스트 */}
                        <button
                            onClick={() => go(`/${locale}/upload`)}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-accent text-toggle-1 hover:bg-accent/90 transition-colors"
                            aria-label={t('upload')}
                        >
                            {/* sm 이하: 아이콘만 표시 */}
                            <IoCloudUploadOutline className="w-5 h-5 text-black sm:hidden" />
                            {/* sm 이상: 텍스트 표시 */}
                            <span className="hidden sm:inline text-black">{t('upload')}</span>
                        </button>
                        <div className="sm:flex hidden items-center gap-2">
                            <ThemeToggle />
                            <LocaleSwitcher />
                        </div>

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
