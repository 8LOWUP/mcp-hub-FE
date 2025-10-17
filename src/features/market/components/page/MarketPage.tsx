// features/market/components/page/MarketPage.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import MarketGrid from "../grid/MarketGrid";
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
}

export default function MarketPage({ initialData }: MarketPageProps) {
    const sp = useSearchParams();
    const cat = (sp.get("cat") ?? "all") as CategoryId;

    // initialData가 있으면 사용하고, 없으면 더미 데이터 사용
    const allData = initialData || DUMMY_MCP_LIST;

    const items = React.useMemo(
        () => (cat === "all" ? allData : allData.filter(i => i.category === cat)),
        [cat, allData]
    );

    return (
        <section>
            <MarketHeader title={getTitleByCategory(cat)} count={items.length} />
            <MarketGrid items={items} />
        </section>
    );
}
