"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

interface LandingSearchBarProps {
    placeholder?: string;
}

const LandingChatStartButton = ({ placeholder = "Search MCP..." }: LandingSearchBarProps) => {
    const router = useRouter();

    // 검색 실행
    const handleSearch = () => {
        router.push(`/chat`);
    };


    return (
        <div
            className={clsx(
                "flex w-full max-w-2xl justify-between items-center",
                " w-full rounded-full bg-surface-2 p-5 py-3",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "border-gray-500 border-1"
        )}>
            {placeholder}
            {/* 우측: 전송 버튼 */}
            <button
                type="button"
                onClick={handleSearch}
                aria-label="Send message"
                className={[
                "shrink-0 grid place-items-center rounded-full size-8",
                "bg-accent text-black",
                "transition active:scale-[0.98]",
                ].join(" ")}
            >
                {/* 종이비행기 아이콘 */}
                <svg
                viewBox="0 0 24 24"
                className="size-4 sm:size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
            </button>
        </div>
    );
}

export default LandingChatStartButton;