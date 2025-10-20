// features/market/components/page/MarketPage.tsx
"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import MarketGrid from "../grid/MarketGrid";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSavedMcps } from "@/hooks/useSavedMcps";
import { DUMMY_MCP_LIST } from "@/constants/mcp-data";
import { getTitleByCategory } from "@/features/market/utils";
import type { CategoryId } from "@/features/market/constants";
import type { McpCardData } from "@/features/market/types";

// ✅ 헤더 컴포넌트
const MarketHeader: React.FC<{ title: string; count?: number }> = ({ title, count }) => {
    const t = useTranslations('MCPMarket');
    return (
        <header className="mb-6">
            <h1 className="text-title1 font-semibold">{title}</h1>
            {typeof count === "number" && (
                <p className="mt-1 text-body3 text-secondary">
                    {count.toLocaleString()} {t('results')}
                </p>
            )}
        </header>
    );
};

interface MarketPageProps {
    initialData?: McpCardData[];
    serverPaginatedData?: McpCardData[];
    serverTotalPages?: number;
    serverCurrentPage?: number;
    serverTotalItems?: number;
    itemsPerPage?: number;
}

export default function MarketPage({ 
    initialData, 
    serverPaginatedData,
    serverTotalPages,
    serverCurrentPage,
    serverTotalItems,
    itemsPerPage = 12 
}: MarketPageProps) {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const cat = (sp.get("cat") ?? "all") as CategoryId;
    const page = parseInt(sp.get("page") ?? "1", 10);

    // 사용자가 저장한 MCP 목록 가져오기
    const { savedMcpIds, isLoggedIn } = useSavedMcps();

    // SSR 데이터가 있으면 우선 사용, 없으면 클라이언트 사이드 페이지네이션 사용
    const isSSR = serverPaginatedData && serverTotalPages && serverCurrentPage && serverTotalItems;
    
    // initialData가 있으면 사용하고, 없으면 더미 데이터 사용
    const allData = initialData || DUMMY_MCP_LIST;

    const items = React.useMemo(
        () => (cat === "all" ? allData : allData.filter(i => i.category === cat)),
        [cat, allData]
    );

    // 저장된 MCP 상태를 적용한 데이터 (로그인한 경우에만)
    const itemsWithSavedStatus = React.useMemo(
        () => items.map(item => ({
            ...item,
            saved: isLoggedIn ? savedMcpIds.includes(item.id) : false
        })),
        [items, savedMcpIds, isLoggedIn]
    );

    // URL 업데이트 함수 (새로고침 없이)
    const updateURL = (newPage: number) => {
        const params = new URLSearchParams(sp.toString());
        if (newPage === 1) {
            params.delete('page');
        } else {
            params.set('page', newPage.toString());
        }
        // router.replace를 사용하여 새로고침 없이 URL만 변경
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // 클라이언트 사이드 페이지네이션 (SSR 데이터가 없을 때만 사용)
    const clientPagination = usePagination({
        data: itemsWithSavedStatus,
        itemsPerPage,
        initialPage: page,
    });

    // SSR 데이터에 저장된 상태 적용 (로그인한 경우에만)
    const serverPaginatedDataWithSaved = React.useMemo(
        () => serverPaginatedData?.map(item => ({
            ...item,
            saved: isLoggedIn ? savedMcpIds.includes(item.id) : false
        })) ?? [],
        [serverPaginatedData, savedMcpIds, isLoggedIn]
    );

    // SSR 데이터 우선 사용
    const {
        currentPage,
        totalPages,
        paginatedData,
        totalItems,
        hasNextPage,
        hasPrevPage,
        goToPage,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
    } = isSSR ? {
        currentPage: serverCurrentPage!,
        totalPages: serverTotalPages!,
        paginatedData: serverPaginatedDataWithSaved,
        totalItems: serverTotalItems!,
        hasNextPage: serverCurrentPage! < serverTotalPages!,
        hasPrevPage: serverCurrentPage! > 1,
        goToPage: (newPage: number) => updateURL(newPage),
        nextPage: () => updateURL(serverCurrentPage! + 1),
        prevPage: () => updateURL(serverCurrentPage! - 1),
        goToFirstPage: () => updateURL(1),
        goToLastPage: () => updateURL(serverTotalPages!),
    } : clientPagination;

    // 페이지 변경 핸들러들 (SSR 데이터 사용 시 URL만 업데이트)
    const handlePageChange = (newPage: number) => {
        if (isSSR) {
            updateURL(newPage);
        } else {
            goToPage(newPage);
            updateURL(newPage);
        }
    };

    const handleNext = () => {
        if (isSSR) {
            updateURL(currentPage + 1);
        } else {
            nextPage();
            updateURL(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (isSSR) {
            updateURL(currentPage - 1);
        } else {
            prevPage();
            updateURL(currentPage - 1);
        }
    };

    const handleFirst = () => {
        if (isSSR) {
            updateURL(1);
        } else {
            goToFirstPage();
            updateURL(1);
        }
    };

    const handleLast = () => {
        if (isSSR) {
            updateURL(totalPages);
        } else {
            goToLastPage();
            updateURL(totalPages);
        }
    };

    // 카테고리가 변경될 때 첫 페이지로 이동
    React.useEffect(() => {
        // 카테고리가 변경되면 항상 첫 페이지로 이동
        if (page !== 1) {
            updateURL(1);
        }
    }, [cat]); // cat이 변경될 때만 실행

    // URL의 page 파라미터가 변경될 때 usePagination에 반영
    React.useEffect(() => {
        // URL이 변경되었을 때 페이지네이션 상태도 업데이트
        // usePagination 훅이 URL 변경을 감지하도록 강제 리렌더링
        window.dispatchEvent(new Event('urlchange'));
    }, [page, cat]);

    return (
        <section className="space-y-6">
            <MarketHeader title={getTitleByCategory(cat)} count={totalItems} />
            <MarketGrid items={paginatedData} />
            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onFirst={handleFirst}
                        onLast={handleLast}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                    />
                </div>
            )}
        </section>
    );
}
