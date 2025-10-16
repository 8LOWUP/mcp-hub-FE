"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";
import { axiosInstance } from "@/services/AxiosInstance";

type SearchItem = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string | null;
};

export default function SearchBar({
                                      placeholder = "Search MCP...",
                                  }: {
    placeholder?: string;
}) {
    const router = useRouter();
    const pathname = usePathname() || "/";
    const locale = pathname.split("/")[1] || "en";

    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // 바깥 클릭 시 드롭다운 닫기
    const rootRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const onDocDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    // 입력 시 자동완성 (디바운스 + AbortController 로 스테일 응답 방지)
    React.useEffect(() => {
        const controller = new AbortController();
        const q = query.trim();

        const run = async () => {
            if (!q) {
                setResults([]);
                setOpen(false);
                return;
            }

            try {
                setLoading(true);

                // ✅ MCP 목록 검색: /mcps (서버 구현 차이 흡수 위해 두 형태 동시 전송)
                const res = await axiosInstance.get("/mcps", {
                    signal: controller.signal,
                    params: {
                        search: q,
                        "request.search": q,
                        page: 0,
                        size: 8,
                        sort: "createdAt,desc",
                        "request.page": 0,
                        "request.size": 8,
                        "request.sort": "createdAt,desc",
                    },
                });

                // ✅ 응답 파싱 (BaseResponse<PageMcpResponse> 또는 직접 Page)
                const payload = res.data?.result ?? res.data ?? {};
                const content =
                    payload?.content ??
                    payload?.result?.content ??
                    (Array.isArray(payload) ? payload : []);

                const items: SearchItem[] = (content || []).map((it: any) => ({
                    id: it.id,
                    name: it.name,
                    description: it.description,
                    imageUrl: it.imageUrl ?? it.iconUrl ?? it.thumbnailUrl ?? null,
                }));

                setResults(items);
                setOpen(true);
            } catch (err: any) {
                if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
                    console.warn("MCP 검색 실패:", err);
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        };

        const t = setTimeout(run, 300);
        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [query]);

    // 검색 버튼 / Enter 이동
    const handleSearch = () => {
        const q = query.trim();
        if (!q) return;
        router.push(`/${locale}/market?search=${encodeURIComponent(q)}`);
        setOpen(false);
    };

    // 항목 클릭 → 상세
    const goDetail = (id: number) => {
        router.push(`/${locale}/detail/${id}`); // ✅ detail 로 맞추기
        setOpen(false);
    };

    return (
        <div ref={rootRef} className="relative w-full">
            {/* 입력창 */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                }}
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
                <div className="absolute left-0 right-0 mt-2 bg-surface-1 border border-accent/20 rounded-xl shadow-lg z-50 overflow-hidden">
                    {loading && (
                        <div className="px-4 py-2 text-sm text-muted">검색 중...</div>
                    )}

                    {!loading && results.length === 0 && query.trim() && (
                        <div className="px-4 py-2 text-sm text-muted">
                            “{query}”에 대한 결과 없음
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <ul className="max-h-80 overflow-auto">
                            {results.map((item, idx) => (
                                <li key={item.id ? `mcp-${item.id}` : `mcp-${idx}`}>
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-accent/10"
                                        onClick={() => goDetail(item.id)}
                                    >
                                        {/* MCP 썸네일 */}
                                        <div className="w-8 h-8 rounded-md overflow-hidden bg-surface-3 border border-accent/10 shrink-0">
                                            <Image
                                                src={
                                                    item.imageUrl
                                                        ? /^https?:\/\//i.test(item.imageUrl)
                                                            ? item.imageUrl
                                                            : `${
                                                                process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                    /\/$/,
                                                                    ""
                                                                ) || ""
                                                            }${item.imageUrl}`
                                                        : "/mcp-fallback.png"
                                                }
                                                alt={item.name || "MCP Thumbnail"}
                                                width={32}
                                                height={32}
                                                className="object-cover w-8 h-8"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        "/mcp-fallback.png";
                                                }}
                                                unoptimized
                                                loader={imageLoader}
                                            />
                                        </div>

                                        {/* 텍스트 */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {item.name}
                                            </p>
                                            {item.description && (
                                                <p className="text-xs text-muted truncate">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
