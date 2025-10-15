// components/layout/LandingHeader.tsx (일부만)
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/searchBar";
import { IoListSharp } from "react-icons/io5";
import imageLoader from "@/lib/imageLoader";
import { MdExtension } from "react-icons/md";
import clsx from "clsx";

type ChattingHeaderProps = { additionalClassName?: string };

export default function ChattingHeader({ additionalClassName }: ChattingHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const locale = pathname.split("/")[1] || "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 커스텀 이벤트 발행 헬퍼
  const emit = (name: string) => {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
  };

  return (
    <header className={clsx("block sticky top-0 z-40", additionalClassName)}>
      <div
        className={clsx(
          "h-20 w-full px-4 sm:px-6 bg-surface-1 transition-colors duration-200",
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
              aria-label="히스토리 열기/닫기"
              title="히스토리"
            >
              <IoListSharp className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/${locale}`)}>
              <Image src="/logo.svg" alt="MCP Hub logo" width={30} height={30} priority loader={imageLoader} unoptimized />
              <span className="hidden pr-1 md:block text-primary text-xl font-bold hover:underline underline-offset-4">
                MCPHub
              </span>
            </div>
          </div>

          {/* 가운데: 검색 */}
          <div className="flex-1 max-w-2xl px-2">
            <SearchBar />
          </div>

          {/* 우측: 액션 + (모바일/태블릿 전용) MCP 버튼 */}
          <div className="flex justify-between items-center gap-2">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full border border-accent-color-1 overflow-hidden">
              <Image src="/catprofile.svg" alt="Profile" width={32} height={32} className="object-cover w-full h-full" loader={imageLoader} unoptimized />
            </div>
            <button
              type="button"
              onClick={() => emit("chat:toggle-right")}
              className="lg:hidden cursor-pointer pb-0.5 hover:bg-foreground/10"
              aria-label="MCP 열기/닫기"
              title="MCP"
            >
              <MdExtension className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}