// components/layout/LandingHeader.tsx (일부만)
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ClientSearchBar from "@/components/ui/ClientSearchBar";
import { IoListSharp } from "react-icons/io5";
import imageLoader from "@/lib/imageLoader";
import { MdExtension } from "react-icons/md";
import clsx from "clsx";
import { useLoginStore } from "@/store/login/login-store";
import LoginModal from "@/features/auth/components/LoginModal";
import { useTranslations } from "next-intl";

type ChattingHeaderProps = { additionalClassName?: string };

export default function ChattingHeader({ additionalClassName }: ChattingHeaderProps) {
  // Locale translations
  const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = useLoginStore(s => s.isLoggedIn);
  const user = useLoginStore(s => s.user);
  const isAuthed = isLoggedIn;

  const [scrolled, setScrolled] = useState(false);
  const locale = pathname.split("/")[1] || "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 로그인 모달 상태
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // 커스텀 이벤트 발행 헬퍼
  const emit = (name: string) => {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
  };

  // 공통 이동
  const go = (to: string) => router.push(to);

  const handleProfileOrLoginClick = () => {
    if (isAuthed) {
        go(`/${locale}/profiles`);
        return;
    }
    // 비로그인 상태라면 로그인 모달 오픈
    openLogin();
  };

  return (
    <header className={clsx("block sticky top-0 z-50", additionalClassName)}>
      <div
        className={clsx(
          "h-20 w-full px-4 sm:px-8 bg-surface-1 transition-colors duration-200",
          scrolled ? "border-b-2 border-accent shadow-md" : "border-b border-transparent"
        )}
      >
        <div className="max-w-screen-3xl mx-auto h-full flex items-center justify-between">
          {/* 좌측: 로고 + (모바일/태블릿 전용) 히스토리 버튼 */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => emit("chat:toggle-left")}
              className="lg:hidden cursor-pointer"
              aria-label={t('historyToggle')}
              title={t('history')}
            >
              <IoListSharp className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/${locale}`)}>
              <Image src="/logo.svg" alt={t('logo')} width={30} height={30} priority loader={imageLoader} unoptimized />
              <span className="hidden pr-1 md:block text-primary text-xl font-bold hover:underline underline-offset-4">
                MCPHub
              </span>
            </div>
          </div>

          {/* 가운데: 검색 */}
          <div className="flex-1 max-w-2xl px-2">
            <ClientSearchBar />
          </div>

          {/* 우측: 액션 + (모바일/태블릿 전용) MCP 버튼 */}
          <div className="flex justify-between items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
            {isAuthed ? (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleProfileOrLoginClick}
                        aria-label={t('openProfile')}
                        className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:cursor-pointer"
                    >
                        <Image
                            src={user?.avatarUrl || "/catprofile.svg"}
                            alt={user?.nickname || t('profile')}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                            loader={imageLoader}
                            unoptimized
                        />
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
            <button
              type="button"
              onClick={() => emit("chat:toggle-right")}
              className="lg:hidden cursor-pointer pb-0.5 hover:bg-foreground/10"
              aria-label={t('mcpToggle')}
              title={t('mcp')}
            >
              <MdExtension className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLogin}
        />
      )}
    </header>
  );
}