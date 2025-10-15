"use client";

import Image from "next/image";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
import imageLoader from "@/lib/imageLoader";
import{useLoginStore } from "@/store/login/login-store"

interface Props {
    data: getMcpDetailResponse["result"];
    isSaved: boolean;
}

<<<<<<< HEAD
export default function MarketHeader({ data, isSaved }: Props) {
    const {isLoggedIn} = useLoginStore();

=======
export default function MarketHeader({ data }: Props) {
>>>>>>> e275768 ([feat]:sparkles: mcp 저장 api연동)
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
    const safeName = data.name || "이름 없음";
    const safeTag = data.categoryName || "태그 없음";
    const safeDownloader = data.savedUserCount ?? 0;
<<<<<<< HEAD
    const displaySaved = isSaved || data.alreadySaved;
=======
    const alreadySaved = data.alreadySaved;
>>>>>>> e275768 ([feat]:sparkles: mcp 저장 api연동)

    return (
        <div className="flex items-center gap-4">
            {/* MCP 로고 */}
            <img
                src={safeLogo}
                alt={`${safeName} logo`}
                className="rounded-lg object-contain w-25 h-25 overflow-hidden"
            />

            <div className="flex-1">
                {/* MCP 이름 */}
                <div className="text-primary mb-4 font-bold text-2xl">
                    {safeName}
                </div>

                {/* 한 줄: 좌측 Tag + Saved 상태 / 우측 Downloader */}
                <div className="flex justify-between items-center mt-1">
                    {/* 왼쪽: Tag + 저장 여부 */}
                    <div className="flex items-center gap-2">

                        {/*저장 상태 표시 */}
<<<<<<< HEAD
                        {isLoggedIn && (
                            displaySaved ? (
                                <div className="inline-block bg-green-400/20 text-green-300 border border-green-400/30 text-xs font-medium px-2 py-1 rounded-full">
                                    저장됨
                                </div>
                            ) : (
                                <div className="inline-block bg-gray-500/20 text-gray-300 border border-gray-500/30 text-xs font-medium px-2 py-1 rounded-full">
                                    저장 안 됨
                                </div>
                            )
=======
                        {alreadySaved ? (
                            <div className="inline-block bg-green-400/20 text-green-300 border border-green-400/30 text-xs font-medium px-2 py-1 rounded-full">
                                저장됨
                            </div>
                        ) : (
                            <div className="inline-block bg-gray-500/20 text-gray-300 border border-gray-500/30 text-xs font-medium px-2 py-1 rounded-full">
                                저장 안 됨
                            </div>
>>>>>>> e275768 ([feat]:sparkles: mcp 저장 api연동)
                        )}

                        {/* 카테고리 태그 */}
                        <div className="inline-block bg-accent text-black text-xs font-medium px-2 py-1 rounded-full">
                            {safeTag}
                        </div>
                    </div>

                    {/* 오른쪽: 다운로드 수 */}
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
