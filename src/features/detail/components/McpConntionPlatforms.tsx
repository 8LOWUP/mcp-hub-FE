"use client";

import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";

interface Props {
    platforms: string[];
}

export default function MarketConnectionPlatforms({ platforms }: Props) {
    // 🔑 플랫폼 이름 → 아이콘 매핑 테이블
    const platformIconMap: Record<string, string> = {
        youtube: "/youtube.svg",
        notion: "/notionLogo.svg",
        google: "/google.svg",
        vscode: "/vscode.svg",
        instagram: "/instagram.svg",
    };

    return (
        <div className="info-block">
            <div className="text-secondary font-semibold text-lg mb-4">
                Connection Platform
            </div>
            <TextContainer className="w-full flex flex-wrap gap-2 items-center">
                {platforms.length > 0 ? (
                    platforms.map((platform, idx) => {
                        // 👇 소문자로 변환해서 매핑 (API에서 "Youtube" / "youtube" 등 혼용될 수 있음)
                        const key = platform.toLowerCase();
                        const iconSrc = platformIconMap[key] || "/default.svg";

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-2 py-1 rounded"
                            >
                                <Image
                                    src={iconSrc}
                                    alt={`${platform} icon`}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="object-contain"
                                />
                                <span className="text-sm capitalize">{platform}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-400 text-sm">플랫폼 정보 없음</div>
                )}
            </TextContainer>
        </div>
    );
}
