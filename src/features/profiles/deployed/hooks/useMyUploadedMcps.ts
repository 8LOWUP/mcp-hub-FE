// src/features/profiles/deployed/hooks/useMyUploadedMcps.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMyUploadedMcps } from "../apis/mcp";
import {
    UploadedMcpItemType,
    UploadedMcpPageType,
    UploadedMcpQueryType,
} from "../types/mcps";

const getErrorText = (e: unknown) => {
    if (!e) return "요청에 실패했습니다.";
    if (typeof e === "string") return e;
    if (e instanceof Error) return e.message;
    // @ts-expect-error 런타임 방어
    return e?.message ?? "요청에 실패했습니다.";
};

export const useMyUploadedMcps = (initialQuery?: UploadedMcpQueryType) => {
    const [query, setQuery] = useState<UploadedMcpQueryType>({
        page: initialQuery?.page ?? 0,
        size: initialQuery?.size ?? 12,
        sort: initialQuery?.sort ?? "publishedDate,desc",
        category: initialQuery?.category ?? "",
        search: initialQuery?.search ?? "",
    });

    const [data, setData] = useState<UploadedMcpPageType>();
    const [items, setItems] = useState<UploadedMcpItemType[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setErr] = useState<string>();

    const fetchList = useCallback(async () => {
        setLoading(true);
        setErr(undefined);
        try {
            const res = await fetchMyUploadedMcps(query);
            setData(res);
            setItems(res?.content ?? []);
        } catch (e) {
            console.error("[useMyUploadedMcps] ✗ error", e);
            setErr(getErrorText(e));
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const pagination = useMemo(
        () => ({
            page: data?.number ?? query.page ?? 0,
            size: data?.size ?? query.size ?? 12,
            totalPages: data?.totalPages ?? 0,
            totalElements: data?.totalElements ?? 0,
            isFirst: !!data?.first,
            isLast: !!data?.last,
        }),
        [data, query]
    );

    const setPage = (next: number) =>
        setQuery((q: UploadedMcpQueryType) => ({ ...q, page: Math.max(0, next) }));
    const setSize = (next: number) =>
        setQuery((q: UploadedMcpQueryType) => ({ ...q, size: next, page: 0 }));
    const setSort = (next: string) =>
        setQuery((q: UploadedMcpQueryType) => ({ ...q, sort: next, page: 0 }));
    const setCategory = (next: string) =>
        setQuery((q: UploadedMcpQueryType) => ({ ...q, category: next, page: 0 }));
    const setSearch = (next: string) =>
        setQuery((q: UploadedMcpQueryType) => ({ ...q, search: next, page: 0 }));

    return {
        query,
        items,
        data,
        pagination,
        isLoading,
        error,
        refetch: fetchList,
        setPage,
        setSize,
        setSort,
        setCategory,
        setSearch,
    };
};
