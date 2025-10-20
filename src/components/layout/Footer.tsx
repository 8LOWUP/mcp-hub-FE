import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import imageLoader from "@/lib/imageLoader";
import { HelpCircle } from "lucide-react";
import ThemeToggle from "../ui/theme-toggle";
import LocaleSwitcher from "../ui/LocaleSwitcher";

const externalLinks = [
    {
        href: "https://github.com/orgs/8LOWUP/repositories", // 우리 레포 주소 주입함.
        alt: "GitHub Icon",
        src: "/github.svg",
        lightSrc: "/github-light.svg",
    },
    {
        href: "https://notion.so", // 추후 노션 주소로 수정
        alt: "Notion Icon",
        src: "/notion.svg",
        lightSrc: "/notionLogo.svg",
    },
];

export default function Footer() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const currentLocale = pathname?.split("/")?.[1] || "ko";
    const supportUrl = `/${currentLocale}/support`;

    // hydration 완료 후에만 테마 감지
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer className="bg-surface-1 border-t border-contrast">
            <div className="max-w-screen px-6 sm:px-20 py-8">
                <div className="flex justify-between items-center">

                    {/* 왼쪽: 로고 및 서비스 이름 */}
                    <div className="hidden sm:flex items-center gap-3 mr-3 ">
                        <Image src="/logo.svg" alt="MCP Hub Logo" width={28} height={28} loader={imageLoader} unoptimized />
                        <div className="flex flex-col">
                            <p className="text-primary font-bold">MCP Hub</p>
                            <p className="text-muted text-body4 mt-1">
                                MCP market with LLM
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:hidden h-14.5 items-start justify-end gap-1">
                        <div className="flex sm:hidden text-muted text-caption1">
                            © 2025 MCP Hub. All rights reserved.
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <LocaleSwitcher />
                        </div>
                    </div>

                    {/* 중앙: 저작권 표시 글씨 */}
                    <div className="hidden sm:flex text-muted text-caption1">
                        © 2025 MCP Hub. All rights reserved.
                    </div>

                    {/* 오른쪽: Support + connection */}
                    <div className="flex items-start h-fit gap-2">
                        {/* Support 링크 */}
                        <div className="flex flex-col items-center gap-2.5">
                            <span className="text-secondary text-caption1 font-bold">support</span>
                            <Link
                                href={supportUrl}
                                className="text-secondary hover:text-primary transition-colors"
                            >
                                <HelpCircle className="w-6.5 h-6.5" />
                            </Link>
                        </div>

                        {/* Connection 섹션 */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-secondary text-caption1 font-bold">connection</span>
                            <div className="flex items-center gap-4">
                                {externalLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.alt}
                                        className={
                                            link.alt === "Notion Icon" ? "mt-2" : 
                                            link.alt === "GitHub Icon" && (mounted ? theme === "dark" : true) ? "" : 
                                            "mt-1.5"
                                        }
                                    >
                                        <Image 
                                            src={mounted ? (theme === "dark" ? link.src : link.lightSrc) : link.src} 
                                            alt={link.alt} 
                                            width={24} 
                                            height={24} 
                                            loader={imageLoader} 
                                            unoptimized 
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
