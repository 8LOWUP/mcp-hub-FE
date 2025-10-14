// src/features/profiles/hooks/useMyMcps.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMyMcps, deleteMyMcp } from "../apis/mcps";
import type { McpItemType, PageRequestType } from "../types/mcps";

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
    const safeSetState = useCallback(<T,>(setter: (v: T) => void, v: T) => {
        if (aliveRef.current) setter(v);
    }, []);

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
                safeSetState(setList, res.content);
                safeSetState(setTotalElements, res.totalElements);
                safeSetState(setTotalPages, res.totalPages);
            } catch (e: any) {
                // eslint-disable-next-line no-console
                console.error("[useMyMcps] error", e);
                safeSetState(
                    setError,
                    e?.message ?? "데이터를 불러오지 못했습니다."
                );
            } finally {
                safeSetState(setIsLoading, false);
            }
        },
        [page, size, search, sort, safeSetState]
    );

    // page/size/sort/search가 바뀌면 자동 재요청
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

            // 낙관적 업데이트 준비 (롤백용 스냅샷)
            const prevList = list;

            // 현재 페이지에서 마지막 1개를 지우는 경우 → 이전 페이지로 이동
            const isLastItemOnPage = list.length === 1 && page > 0;

            try {
                // ✅ mcpId 기준으로 필터 (숫자 비교가 가장 안전)
                setList((cur) => cur.filter((it) => it.mcpId !== numericId));

                // 디버깅 로그
                // eslint-disable-next-line no-console
                console.log("[HOOK] deleteOne start:", numericId);

                await deleteMyMcp(numericId);

                const nextPage = isLastItemOnPage ? page - 1 : page;
                if (isLastItemOnPage) setPage(nextPage);

                // 페이지/검색 조건 유지하여 재조회
                await fetchList({ page: nextPage, size, search, sort });

                // eslint-disable-next-line no-console
                console.log("[HOOK] deleteOne ok:", true);
                return true;
            } catch (e: any) {
                safeSetState(setList, prevList); // 실패 시 롤백
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
        deleteOne, // ✅ 삭제 노출
    };
};
