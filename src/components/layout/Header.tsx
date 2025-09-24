"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/searchBar";
import clsx from "clsx";

type LandingHeaderProps = {
  additionalClassName?: string;
};

export default function LandingHeader({ additionalClassName }: LandingHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // 현재 locale 추출 (URL의 첫 번째 경로 조각)
  const locale = pathname.split("/")[1] || "en";

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // sm 이상에서만 보이도록 hidden / sm:block 추가
    <header
      className={clsx(
        "sticky top-0 z-40",
        additionalClassName
      )}
    >
      <div
        className={clsx(
          "h-20 w-full px-10 bg-surface-1 transition-colors duration-200",
          scrolled
            ? "border-b-2 border-accent shadow-md"
            : "border-b border-transparent"
        )}
      >
        <div className="w-full h-full flex items-center justify-between px-6">
          {/* 로고 + MCP Market */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="MCP Hub logo"
              width={24}
              height={24}
              priority
            />
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => router.push(`/${locale}`)}
            >
              <span className="text-primary font-bold hover:underline hover:decoration-accent underline-offset-4">
                MCP Hub
              </span>
            </div>

            <div
              className="cursor-pointer px-4 py-2 rounded-md flex items-center justify-center"
              onClick={() => router.push(`/${locale}/market`)}
            >
              <span className="hidden md:flex text-primary font-semibold hover:underline hover:decoration-accent underline-offset-4">
                MCP Market
              </span>
            </div>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-xl px-4">
            <SearchBar />
          </div>

          {/* 오른쪽 액션 */}
          <div className="flex items-center gap-x-3">
            <PrimaryButton
              onClick={() => router.push(`/${locale}/upload`)}
              variant="primary"
              size="md"
              additionalClassName="hidden md:flex h-9 px-6"
            >
              <span className="text-title5">Upload</span>
            </PrimaryButton>
            <ThemeToggle />
            <LocaleSwitcher />
            <div className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden">
              <Image
                src="/catprofile.svg"
                alt="Profile"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}