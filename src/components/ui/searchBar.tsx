"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchBarProps {
    placeholder?: string;
}

export default function SearchBar({ placeholder = "Search MCP..." }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // 검색 실행
    const handleSearch = () => {
        if (!query) return;
        // 나중에 검색 결과 페이지 또는 리스트로 이동
        router.push(`/mcp/search?query=${encodeURIComponent(query)}`);
    };

    // Enter 키 눌러도 검색 가능!
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="w-full rounded-full bg-surface-3 py-2 pl-4 pr-10
                   text-sm text-foreground placeholder:text-muted-foreground
                   focus:ring-primary"
            />
            <button
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center"
                aria-label="Search"
                onClick={handleSearch}
            >
                <Image
                    src="/search.svg"
                    alt="Search"
                    width={18}
                    height={18}
                />
            </button>
        </div>
    );
}
