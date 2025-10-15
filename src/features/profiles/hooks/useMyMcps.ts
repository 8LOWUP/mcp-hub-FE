"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMyMcps, deleteMyMcp } from "../apis/mcps";
import type { McpItemType, PageRequestType } from "../types/mcps";

/** 서버 응답 아이템(필요 필드만 추정 정의) */
type ServerMcpItem = {
    id: number | string;
    name?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    licenseId?: number;
    platformId?: number;          // 🔹 새 스웨거
    platformName?: string;
    createdAt?: string;
    published?: boolean;

    // 과거/기타 형태 호환 (혹시 남아있다면)
    platform?: { id?: string | number; name?: string };
    platform_code?: string | number;
    platform_id?: string | number;
};

/** 서버 → 카드 타입 매퍼: platformId를 문자열로 표준화(없으면 undefined) */
const mapServerToCard = (it: ServerMcpItem): McpItemType => {
    const idNum = Number(it.id);
    const title = it.name ?? it.title ?? `MCP #${it.id}`;

    const rawPlatformId =
        it.platformId ??
        it.platform?.id ??
        (it as any).platform_code ??
        (it as any).platform_id ??
        null;

    const platformId = rawPlatformId != null ? String(rawPlatformId) : undefined;

    if (!platformId) {
        // 디버깅 편의 로그
        // eslint-disable-next-line no-console
        console.warn("[useMyMcps] platformId missing for item:", {
            id: it.id,
            name: it.name,
            platform: it.platform,
            platformId: it.platformId,
            platform_code: (it as any).platform_code,
            platform_id: (it as any).platform_id,
        });
    }

    return {
        id: String(it.id),
        mcpId: Number.isNaN(idNum) ? 0 : idNum,
        platformId, // 문자열 or undefined

        title,
        description: it.description ?? "",
        imageUrl: it.imageUrl ?? "",
        categoryName: undefined,
        platformName: it.platformName ?? it.platform?.name ?? "",
        licenseName: undefined,
        createdAt: it.createdAt ?? "",
        apiKey: undefined,
        published: !!it.published,
    };
};

export const useMyMcps = (
    initialParams: PageRequestType = { page: 0, size: 12 }
) => {
    const [list, setList] = useState<McpItemType[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [page, setPage] = useState(initialParams.page ?? 0);
    const [size, setSize] = useState(initialParams.size ?? 12);
    const [search, setSearch] = useState<string | undefined>(initialParams.search);
    const [sort, setSort] = useState<string | undefined>(initialParams.sort);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 언마운트/연속 호출 안전장치
    const aliveRef = useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => {
            aliveRef.current = false;
        };
    }, []);
    const safeSetState = useCallback<<T>(setter: (v: T) => void, v: T) => void>(
        (setter, v) => {
            if (aliveRef.current) setter(v);
        },
        []
    );

    const fetchList = useCallback(
        async (override?: Partial<PageRequestType>) => {
            safeSetState(setIsLoading, true);
            safeSetState(setError, null);

            const query = {
                page: override?.page ?? page,
                size: override?.size ?? size,
                search: override?.search ?? search,
                sort: override?.sort ?? sort,
            };

            try {
                const res = await fetchMyMcps(query);
                const mapped = (res.content as ServerMcpItem[]).map(mapServerToCard);
                safeSetState(setList, mapped);
                safeSetState(setTotalElements, res.totalElements);
                safeSetState(setTotalPages, res.totalPages);
            } catch (e: any) {
                // eslint-disable-next-line no-console
                console.error("[useMyMcps] error", e);
                safeSetState(setError, e?.message ?? "데이터를 불러오지 못했습니다.");
            } finally {
                safeSetState(setIsLoading, false);
            }
        },
        [page, size, search, sort, safeSetState]
    );

    useEffect(() => {
        fetchList();
    }, [page, size, search, sort, fetchList]);

    const deleteOne = useCallback(
        async (mcpId: string | number) => {
            const numericId = Number(mcpId);
            if (Number.isNaN(numericId)) {
                safeSetState(setError, "유효하지 않은 MCP ID입니다.");
                return false;
            }

            const prevList = list;
            const isLastItemOnPage = list.length === 1 && page > 0;

            try {
                setList((cur) => cur.filter((it) => it.mcpId !== numericId));
                await deleteMyMcp(numericId);

                const nextPage = isLastItemOnPage ? page - 1 : page;
                if (isLastItemOnPage) setPage(nextPage);
                await fetchList({ page: nextPage, size, search, sort });

                return true;
            } catch (e: any) {
                safeSetState(setList, prevList);
                // eslint-disable-next-line no-console
                console.error("[useMyMcps.deleteOne] error", e);
                safeSetState(setError, e?.message ?? "삭제에 실패했습니다.");
                return false;
            }
        },
        [list, page, size, search, sort, fetchList, safeSetState]
    );

    return {
        list,
        totalPages,
        totalElements,
        page,
        size,
        search,
        sort,
        isLoading,
        error,
        setPage,
        setSize,
        setSearch,
        setSort,
        fetchList,
        deleteOne,
    };
};
