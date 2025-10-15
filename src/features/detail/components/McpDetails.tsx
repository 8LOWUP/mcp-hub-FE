"use client";

import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";
<<<<<<< HEAD
import { McpDetail } from "../hooks/types";
import imageLoader from "@/lib/imageLoader";
=======
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
>>>>>>> JNII-194-상세페이지API연동

interface Props {
    data: getMcpDetailResponse["result"];
}

export default function McpDetails({ data }: Props) {
    return (
        <>
            <div className="text-secondary font-semibold text-lg">Details</div>
            <TextContainer className="w-full">
                <div className="space-y-5">
                    {/* Developer Name */}
                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Developer Name</div>
<<<<<<< HEAD
                        <div className="text-white">{data.developerName}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Published</div>
                        <div className="text-white">{data.published}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-secondary">Source Code</div>
                        <div>
                            <a
                                href={data.sourceCode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-white space-x-2 hover:underline"
                            >
                                <span>{data.sourceCode}</span>
                                <Image src="/sourceCode.svg"
                                       alt="Source Code Icon"
                                       width={10} height={10}
                                       className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-125"
                                       loader={imageLoader}
                                       unoptimized />
                            </a>
=======
                        <div className="text-white">
                            {data.developerName || "N/A"}
>>>>>>> JNII-194-상세페이지API연동
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
                                    <span className="truncate max-w-[200px]">
                                        {data.sourceUrl}
                                    </span>
                                    <Image
                                        src="/sourceCode.svg"
                                        alt="Source Code Icon"
                                        width={14}
                                        height={14}
                                        className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-125"
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

                    {/* ✅ Connection Platform (string만) */}
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
