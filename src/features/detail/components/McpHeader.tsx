"use client";

import Image from "next/image";
<<<<<<< HEAD
import { McpDetail } from "@/features/detail/hooks/types";
import imageLoader from "@/lib/imageLoader";
=======
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
>>>>>>> JNII-194-상세페이지API연동

interface Props {
    data: getMcpDetailResponse["result"];
}

export default function MarketHeader({ data }: Props) {

    const buildImageUrl = (path?: string | null) => {
        if (!path || path.trim() === "") return "/placeholder.png";

        // 중복 슬래시 방지
        if (path.startsWith("/")) {
            return `/__api${path}`;
        } else {
            return `/__api/${path}`;
        }
    };

    const safeLogo = buildImageUrl(data.imageUrl);
    console.log("✅ safeLogo URL:", safeLogo); //콘솔 확인용.

    const safeName = data.name || "이름 없음";
    const safeTag = data.categoryName || "태그 없음";
    const safeDownloader = data.savedUserCount ?? 0;

    return (
        <div className="flex items-center gap-4">
            {/* MCP 로고 */}
<<<<<<< HEAD
            <Image
                src={data.mcpLogo}
                alt={`${data.mcpLogo} logo`}
                width={100}
                height={100}
                className="rounded-lg object-contain"
                loader={imageLoader}
                unoptimized
=======
            <img
                src={safeLogo}
                alt={`${safeName} logo`}
                className="rounded-lg object-contain w-25 h-25 overflow-hidden"
>>>>>>> JNII-194-상세페이지API연동
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
                            loader={imageLoader}
                            unoptimized
                        />
                        <span className="text-sm">{safeDownloader}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
