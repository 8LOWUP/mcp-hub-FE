"use client";

import { useState, useCallback } from "react";
import TextContainer from "@/components/container/TextContainer";
<<<<<<< HEAD
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";
=======
import { CopyCheck } from "lucide-react";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
>>>>>>> JNII-194-상세페이지API연동

interface Props {
    url?: getMcpDetailResponse["result"]["requestUrl"];
}

export default function McpUrlCopy({ url }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("❌ URL 복사 실패:", err);
        }
    }, [url]);

    return (
        <div className="info-block relative">
            <div className="text-secondary font-semibold text-lg mb-4">URL</div>
<<<<<<< HEAD
            <TextContainer className="w-full flex items-center justify-between gap-2">
                <span className="truncate text-white">{url}</span>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                    className="hover:opacity-70"
                >
                    <Image src="/urlcopy.svg" alt="Copy URL" width={16} height={16} className="w-5 h-5" loader={imageLoader} unoptimized />
                </button>
            </TextContainer>
=======
>>>>>>> JNII-194-상세페이지API연동

            {!url ? (
                <TextContainer className="w-full text-gray-400 text-sm p-4">
                    등록된 URL이 없습니다.
                </TextContainer>
            ) : (
                <>
                    <TextContainer className="w-full flex items-center justify-between gap-2">
                        {/* ✅ 왼쪽에 URL */}
                        <span className="truncate text-white flex-1">{url}</span>

                        {/* ✅ 오른쪽에 버튼 (url 있을 때만 렌더링) */}
                        <button
                            onClick={handleCopy}
                            className="hover:opacity-70 flex-shrink-0"
                        >
                            <CopyCheck className="w-5 h-5 text-white" />
                        </button>
                    </TextContainer>

                    {/* ✅ 복사 안내 문구 */}
                    {copied && (
                        <div className="absolute top-0 right-0 mt-[-28px] bg-black text-white text-xs px-2 py-1 rounded shadow">
                            Copied!
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
