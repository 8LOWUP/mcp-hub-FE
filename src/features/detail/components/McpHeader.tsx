"use client";

import Image from "next/image";
import { McpDetail } from "@/features/detail/hooks/types";
import imageLoader from "@/lib/imageLoader";

interface Props {
    data: McpDetail;
}

export default function MarketHeader({ data }: Props) {
    return (
        <div className="flex items-center gap-4">
            {/* MCP 로고 */}
            <Image
                src={data.mcpLogo}
                alt={`${data.mcpLogo} logo`}
                width={100}
                height={100}
                className="rounded-lg object-contain"
                loader={imageLoader}
            />

            <div className="flex-1">
                {/* MCP 이름 */}
                <div className="text-primary mb-4 font-bold text-2xl">{data.mcpName}</div>

                {/* 한 줄: 좌측 Tag, 우측 Downloader */}
                <div className="flex justify-between items-center mt-1">
                    {/* 왼쪽 끝: Tag */}
                    <div className="inline-block bg-accent text-black text-xs font-medium px-2 py-1 rounded-full">
                        {data.tag}
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
                        />
                        <span className="text-sm">{data.downloader}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
