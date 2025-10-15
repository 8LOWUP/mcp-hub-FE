// src/features/profiles/deployed/hooks/useMyUploadedMcps.ts
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyUploadedMcps } from "../apis/mcp";
import {
    UploadedMcpItemType,
    UploadedMcpPageType,
    UploadedMcpQueryType,
} from "../types/mcps";

/** 업로드/프로필 공통으로 쓸 쿼리키 프리픽스 (invalidate 시 한 번에 갱신) */
export const UPLOADED_MCPS_QK = ["myUploadedMcps"];

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
        // ✅ 배포 최신순이 기본
        sort: initialQuery?.sort ?? "publishedDate,desc",
        category: initialQuery?.category ?? "",
        search: initialQuery?.search ?? "",
    });

    const {
        data,
        isFetching: isLoading,
        error,
        refetch,
    } = useQuery<UploadedMcpPageType>({
        /** ✅ 동일 프리픽스 + 파라미터를 키로 */
        queryKey: [...UPLOADED_MCPS_QK, query],
        queryFn: () => fetchMyUploadedMcps(query),
        staleTime: 30_000,
        gcTime: 300_000,
        refetchOnWindowFocus: true,
        refetchOnMount: "always",
    });

    /** 서버 content 배열 → 아이템들 */
    const items: UploadedMcpItemType[] = useMemo(
        () => data?.content ?? [],
        [data]
    );

    /** 페이지네이션 정보 */
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

    /** setter들 (페이지/정렬/검색 등 변경 시 자동 refetch) */
    const setPage = (next: number) =>
        setQuery((q) => ({ ...q, page: Math.max(0, next) }));
    const setSize = (next: number) =>
        setQuery((q) => ({ ...q, size: next, page: 0 }));
    const setSort = (next: string) =>
        setQuery((q) => ({ ...q, sort: next, page: 0 }));
    const setCategory = (next: string | number) =>
        setQuery((q) => ({ ...q, category: next as any, page: 0 }));
    const setSearch = (next: string) =>
        setQuery((q) => ({ ...q, search: next, page: 0 }));

    return {
        query,
        items,
        data,
        pagination,
        isLoading,
        error: error ? getErrorText(error) : undefined,
        refetch,
        setPage,
        setSize,
        setSort,
        setCategory,
        setSearch,
    };
};
