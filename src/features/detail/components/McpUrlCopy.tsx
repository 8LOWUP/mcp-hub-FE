"use client";

import { useState } from "react";
import TextContainer from "@/components/container/TextContainer";
import Image from "next/image";

interface Props {
    url: string;
}

export default function McpUrlCopy({ url }: Props) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="info-block relative">
            <div className="text-secondary">URL</div>
            <TextContainer className="w-full flex items-center justify-between gap-2">
                <span className="truncate">{url}</span>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                    className="hover:opacity-70"
                >
                    <Image src="/urlcopy.svg" alt="Copy URL" width={16} height={16} className="w-5 h-5" />
                </button>
            </TextContainer>

            {copied && (
                <div className="absolute top-0 right-0 mt-[-28px] bg-black text-white text-xs px-2 py-1 rounded shadow">
                    Copied!
                </div>
            )}
        </div>
    );
}
