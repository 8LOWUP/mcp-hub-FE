"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";
import { serverAxios } from "@/lib/serverAxios";
import SearchResultItem from "./SearchResultItem";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

type SearchItem = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string | null;
};

import { processMcpImageUrl } from "@/utils/imageUtils";

// API 응답 파싱 함수
const parseSearchResponse = (data: any): SearchItem[] => {
    const payload = data?.result ?? data ?? {};
    const content = payload?.content ?? payload?.result?.content ?? (Array.isArray(payload) ? payload : []);
    
    return (content || []).map((it: any) => ({
        id: it.id,
        name: it.name,
        description: it.description,
        imageUrl: processMcpImageUrl(it.imageUrl),
    }));
};

export default function SearchBar({
    placeholder = "Search MCP...",
}: {
    placeholder?: string;
}) {
    // Locale translations
    const t = useTranslations('MCPMarket');
    const router = useRouter();
    const pathname = usePathname() || "/";
    const locale = pathname.split("/")[1] || "en";

    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // 입력 핸들러들
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    
    React.useEffect(() => {
        const controller = new AbortController();
        const q = debouncedQuery.trim();

        if (!q) {
            setResults([]);
            setOpen(false);
            return;
        }

        let active = true;
        (async () => {
            try {
                setLoading(true);
                const items = await fetchSearchResults(q, controller.signal);

                if (!active) {
                    return;
                }
                setResults(items);
                setOpen(items.length >= 0);
            } catch (err: any) {
                if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
                    if (!active) return;
                    setResults([]);
                    setOpen(false);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
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
                placeholder={placeholder || t('searchPlaceholder')}
                className="w-full rounded-md bg-surface-3 py-2 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:ring-primary"
                aria-label={t('searchMcps')}
            />

            {/* 검색 버튼 */}
            <button
                type="button"
                aria-label={t('search')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                onClick={handleSearch}
            >
                <Image
                    src="/search.svg"
                    alt={t('searchIcon')}
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
                        <div className="px-4 py-2 text-sm text-muted">{t('searching')}</div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted">
                            {t('noResultsFor', { query })}
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
