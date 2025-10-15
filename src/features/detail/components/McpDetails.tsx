"use client";

import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
<<<<<<< HEAD
import imageLoader from "@/lib/imageLoader";
=======
>>>>>>> e796a77 ([feat]:sparkles: 제목 컴포넌트 추가)
import {BadgeAlert } from "lucide-react";

interface Props {
    data: getMcpDetailResponse["result"];
}

export default function McpDetails({ data }: Props) {
    return (
        <>
            <div className="flex items-center gap-2 mb-1">
                <BadgeAlert  className="w-5 h-5"/>
                <span className="text-white font-bold text-xl tracking-tight">Detail</span>
            </div>

            <TextContainer className="w-full">
                <div className="space-y-5">
                    {/* Developer Name */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Developer Name</div>
                        <div className="text-white">
                            {data.developerName || "N/A"}
                        </div>
                    </div>

                    {/* Published */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Published</div>
                        <div className="text-white">
                            {data.publishDate
                                ? new Date(data.publishDate).toLocaleDateString()
                                : "N/A"}
                        </div>
                    </div>

                    {/* Source Code */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Source Code</div>
                        <div>
                            {data.sourceUrl ? (
                                <a
                                    href={data.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-white space-x-2 hover:underline"
                                >
                                    <span className="truncate block max-w-[160px] text-right">
                                      {data.sourceUrl}
                                    </span>
                                    <Image
                                        src="/sourceCode.svg"
                                        alt="Source Code Icon"
                                        width={14}
                                        height={14}
                                        className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-125"
                                        loader={imageLoader}
                                        unoptimized
                                    />
                                </a>
                            ) : (
                                <span className="text-white">N/A</span>
                            )}
                        </div>
                    </div>

                    {/* License */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">License</div>
                        <div className="text-white">
                            {data.licenseName || "N/A"}
                        </div>
                    </div>

                    {/* Connection Platform */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Connection Platform</div>
                        <div className="text-white">
                            {data.platformName || "N/A"}
                        </div>
                    </div>
                </div>
            </TextContainer>
        </>
    );
}
