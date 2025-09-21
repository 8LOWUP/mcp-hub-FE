import Image from "next/image";
import Link from "next/link";

const externalLinks = [
    {
        href: "https://github.com/orgs/8LOWUP/repositories", // 우리 레포 주소 주입함.
        alt: "GitHub Icon",
        src: "/github.svg",
    },
    {
        href: "https://notion.so", // 추후 노션 주소로 수정
        alt: "Notion Icon",
        src: "/notion.svg",
    },
];

export default function Footer() {
    return (
        <footer className="bg-surface-1 border-t border-contrast">
            <div className="max-w-screen-2xl mx-auto px-20 py-8">
                <div className="flex justify-between items-center">

                    {/* 왼쪽: 로고 및 서비스 이름 */}
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" alt="MCP Hub Logo" width={28} height={28} />
                        <div>
                            <p className="text-primary font-bold">MCP Hub</p>
                            <p className="text-muted text-body4 mt-1">
                                MCP market with LLM
                            </p>
                        </div>
                    </div>

                    {/* 중앙: 저작권 표시 글씨 */}
                    <div className="text-muted text-caption1">
                        © 2025 MCP Hub. All rights reserved.
                    </div>

                    {/* 오른쪽: 외부 링크 아이콘 + connection 글씨 */}
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
                                    className={link.alt === "Notion Icon" ? "mt-2" : ""}
                                >
                                    <Image src={link.src} alt={link.alt} width={24} height={24} />
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
