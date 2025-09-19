"use client";

import { useState, useEffect } from "react"; // ✅ 추가
import Image from "next/image";
import { useRouter } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/searchBar";

export default function LandingHeader() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    // 스크롤 감지
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-40 shadow-md">
            {/* 배경 + border */}
            <div
                className={`relative top-0 left-0 right-0 z-20 h-20 px-10 bg-surface-1 transition-colors duration-200 ${
                    scrolled
                        ? "border-b-2 border-accent"
                        : "border-b border-transparent"
                }`}
            >
                <div className="max-w-screen-2xl h-full flex items-center justify-between px-6">
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
                            className="flex flex-col cursor-pointer "
                            onClick={() => router.push("/")}
                        >
                            <span className="text-primary font-bold ">MCP Hub</span>
                        </div>

                        <div
                            className="cursor-pointer px-4 py-2 rounded-md flex items-center justify-center relative"
                            onClick={() => router.push("/market")}
                        >
                            <span className="hidden md:flex text-primary font-semibold">MCP Market</span>
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent hover:bg-accent transition-all"></span>
                        </div>
                    </div>

                    {/* 검색바 */}
                    <div className="flex-1 max-w-xl">
                        <SearchBar />
                    </div>

                    {/* 오른쪽 액션 */}
                    <div className="flex items-center gap-x-3">
                        <PrimaryButton
                            onClick={() => router.push("/upload")}
                            variant="primary"
                            size="md"
                            className="hidden md:flex h-9 px-15"
                        >
                            <span className="text-title5">Upload</span>
                        </PrimaryButton>
                        <ThemeToggle  />
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
