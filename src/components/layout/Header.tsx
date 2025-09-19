"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/searchBar";

export default function LandingHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    const locale = pathname.split("/")[1] || "en";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={[
                "sticky top-0 z-40",
                "bg-surface-1 transition-colors duration-200",
                scrolled ? "border-b-2 border-accent shadow-md" : "border-b border-transparent",
            ].join(" ")}
        >
            <div className="h-20 max-w-screen-2xl mx-auto px-6 flex items-center gap-4">
                {/* 좌측: 로고/마켓 */}
                <div className="flex items-center gap-2 shrink-0">
                    <Image src="/logo.svg" alt="MCP Hub logo" width={24} height={24} priority />
                    <div
                        className="flex flex-col cursor-pointer"
                        onClick={() => router.push(`/${locale}`)}
                    >
            <span className="text-primary font-bold hover:underline hover:decoration-accent underline-offset-8">
              MCP Hub
            </span>
                    </div>
                    <button
                        className="px-4 py-2 rounded-md hidden sm:flex items-center"
                        onClick={() => router.push(`/${locale}/market`)}
                    >
            <span className="text-primary font-semibold hover:underline hover:decoration-accent underline-offset-8">
              MCP Market
            </span>
                    </button>
                </div>

                {/* 가운데: 검색바 — flex-1 + min-w-0 가 핵심 */}
                <div className="flex-1 min-w-0 hidden md:block">
                    <SearchBar />
                </div>

                {/* 우측: 액션 */}
                <div className="flex items-center gap-x-3 shrink-0">
                    <PrimaryButton
                        onClick={() => router.push(`/${locale}/upload`)}
                        variant="primary"
                        size="md"
                        className="hidden md:flex h-9 px-4"
                    >
                        <span className="text-title5">Upload</span>
                    </PrimaryButton>
                    <ThemeToggle />
                    <LocaleSwitcher />
                    <div className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden">
                        <Image src="/catprofile.svg" alt="Profile" width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                </div>
            </div>
        </header>
    );
}
