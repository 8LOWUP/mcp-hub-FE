// src/features/profiles/hooks/useMyMcps.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMyMcps } from "../apis/mcps";
import { McpItemType, PageRequestType } from "../types/mcps";

export const useMyMcps = (initialParams: PageRequestType = { page: 0, size: 12 }) => {
    const [list, setList] = useState<McpItemType[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(initialParams.page ?? 0);
    const [size, setSize] = useState(initialParams.size ?? 12);
    const [search, setSearch] = useState<string | undefined>(initialParams.search);
    const [sort, setSort] = useState<string | undefined>(initialParams.sort);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(
        async (override?: Partial<PageRequestType>) => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetchMyMcps({
                    page: override?.page ?? page,
                    size: override?.size ?? size,
                    search: override?.search ?? search,
                    sort: override?.sort ?? sort,
                });
                setList(res.content);
                setTotalElements(res.totalElements);
                setTotalPages(res.totalPages);
            } catch (e: any) {
                // eslint-disable-next-line no-console
                console.error("[useMyMcps] error", e);
                setError(e?.message ?? "데이터를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        },
        [page, size, search, sort]
    );

    useEffect(() => {
        fetchList();
    }, [fetchList]);

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
        fetchList, // ✅ 이름 통일
    };
};
