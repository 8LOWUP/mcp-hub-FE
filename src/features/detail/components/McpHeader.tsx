"use client";

import Image from "next/image";
import type { McpItem } from "@/types/detail/detail-types"; // ✅ 여기서 타입 가져오기

interface Props {
    data: McpItem; // ✅ McpItem으로 수정
}

export default function MarketHeader({ data }: Props) {
    const safeLogo =
        data.imageUrl && data.imageUrl.trim() !== ""
            ? data.imageUrl
            : "/placeholder.png";
    const safeName = data.name || "이름 없음";
    const safeTag = data.categoryName || "태그 없음";
    const safeDownloader = data.savedUserCount ?? 0;

    return (
        <div className="flex items-center gap-4">
            {/* MCP 로고 */}
            <Image
                src={safeLogo}
                alt={`${safeName} logo`}
                width={100}
                height={100}
                unoptimized
                className="rounded-lg object-contain"
            />

            <div className="flex-1">
                {/* MCP 이름 */}
                <div className="text-primary mb-4 font-bold text-2xl">
                    {safeName}
                </div>

                {/* 한 줄: 좌측 Tag, 우측 Downloader */}
                <div className="flex justify-between items-center mt-1">
                    {/* 왼쪽 끝: Tag */}
                    <div className="inline-block bg-accent text-black text-xs font-medium px-2 py-1 rounded-full">
                        {safeTag}
                    </div>

                    {/* 오른쪽 끝: Downloader */}
                    <div className="flex items-center gap-1">
                        <Image
                            src="/downloader.svg"
                            alt="Downloader Icon"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                        />
                        <span className="text-sm">{safeDownloader}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
