"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";
import { serverAxios } from "@/lib/serverAxios";
import SearchResultItem from "./SearchResultItem";
import { useDebounce } from "@/hooks/useDebounce";

type SearchItem = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string | null;
};

// 이미지 URL 처리 함수
const processImageUrl = (path?: string | null) => {
    if (!path || path.trim() === "") return null;
    if (/^https?:\/\//i.test(path)) return path; // 절대 URL은 그대로
    // 중복 슬래시 방지
    return path.startsWith("/") ? `/__api${path}` : `/__api/${path}`;
};

// API 응답 파싱 함수
const parseSearchResponse = (data: any): SearchItem[] => {
    const payload = data?.result ?? data ?? {};
    const content = payload?.content ?? payload?.result?.content ?? (Array.isArray(payload) ? payload : []);
    
    return (content || []).map((it: any) => ({
        id: it.id,
        name: it.name,
        description: it.description,
        imageUrl: processImageUrl(it.imageUrl),
    }));
};

export default function SearchBar({
    placeholder = "Search MCP...",
}: {
    placeholder?: string;
}) {
    console.log("🔍 SearchBar 컴포넌트 렌더링됨");
    const router = useRouter();
    const pathname = usePathname() || "/";
    const locale = pathname.split("/")[1] || "en";

    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // 입력 핸들러들
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("🔍 입력 변경:", e.target.value);
        setQuery(e.target.value);
    }, []);

    const handleInputFocus = React.useCallback(() => {
        if (query.trim()) setOpen(true);
    }, [query]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const q = query.trim();
            if (!q) return;
            router.push(`/${locale}/market?search=${encodeURIComponent(q)}`);
            setOpen(false);
        }
    }, [query, router, locale]);


    // 바깥 클릭 시 드롭다운 닫기
    const rootRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const onDocDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    // 검색 API 호출 함수
    const fetchSearchResults = React.useCallback(async (searchQuery: string, signal: AbortSignal) => {
        const res = await serverAxios.get("/mcps", {
            signal,
            params: {
                search: searchQuery,
                "request.search": searchQuery,
                page: 0,
                size: 8,
                sort: "createdAt,desc",
                "request.page": 0,
                "request.size": 8,
                "request.sort": "createdAt,desc",
            },
        });
        return parseSearchResponse(res.data);
    }, []);

    // 입력 시 자동완성 (useDebounce + AbortController)
    const debouncedQuery = useDebounce(query, 500);
    
    // 디버깅용 로그
    console.log("🔍 query:", query, "debouncedQuery:", debouncedQuery);
    
    React.useEffect(() => {
        console.log("🔍 useEffect 실행됨, debouncedQuery:", debouncedQuery);
        const controller = new AbortController();
        const q = debouncedQuery.trim();

        if (!q) {
            console.log("🔍 빈 쿼리, 결과 초기화");
            setResults([]);
            setOpen(false);
            return;
        }

        console.log("🔍 검색 시작:", q);
        let active = true;
        (async () => {
            try {
                setLoading(true);
                console.log("🔍 API 호출 시작");
                const items = await fetchSearchResults(q, controller.signal);

                if (!active) {
                    console.log("🔍 컴포넌트가 비활성화됨, 결과 무시");
                    return;
                }
                console.log("🔍 검색 결과:", items);
                setResults(items);
                setOpen(items.length >= 0);
            } catch (err: any) {
                console.log("🔍 에러 발생:", err);
                if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
                    console.warn("MCP 검색 실패:", err);
                    if (!active) return;
                    setResults([]);
                    setOpen(false);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            console.log("🔍 cleanup 실행");
            active = false;
            controller.abort();
        };
    }, [debouncedQuery, fetchSearchResults]);

    // 네비게이션 함수들
    const navigateToMarket = React.useCallback((searchQuery: string) => {
        router.push(`/${locale}/market?search=${encodeURIComponent(searchQuery)}`);
        setOpen(false);
    }, [router, locale]);

    const navigateToDetail = React.useCallback((id: number) => {
        router.push(`/${locale}/detail/${id}`);
        setOpen(false);
    }, [router, locale]);

    // 검색 버튼 / Enter 이동
    const handleSearch = React.useCallback(() => {
        const q = query.trim();
        if (!q) return;
        navigateToMarket(q);
    }, [query, navigateToMarket]);

    // 항목 클릭 → 상세
    const goDetail = React.useCallback((id: number) => {
        navigateToDetail(id);
    }, [navigateToDetail]);


    return (
        <div ref={rootRef} className="relative w-full">
            {/* 입력창 */}
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full rounded-md bg-surface-3 py-2 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:ring-primary"
                aria-label="Search MCPs"
            />

            {/* 검색 버튼 */}
            <button
                type="button"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                onClick={handleSearch}
            >
                <Image
                    src="/search.svg"
                    alt="Search Icon"
                    width={18}
                    height={18}
                    loader={imageLoader}
                    unoptimized
                />
            </button>

            {/* 자동완성 드롭다운 */}
            {open && (
                <div className="absolute left-0 right-0 mt-2 bg-surface-1 py-0.5 border border-accent/20 rounded-xl shadow-lg z-[9999] overflow-hidden">
                    {loading && (
                        <div className="px-4 py-2 text-sm text-muted">검색 중...</div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted">
                            “{query}”에 대한 결과 없음
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <ul className="max-h-80 overflow-auto">
                            {results.map((item) => (
                                <SearchResultItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    description={item.description}
                                    imageUrl={item.imageUrl}
                                    onClick={goDetail}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
