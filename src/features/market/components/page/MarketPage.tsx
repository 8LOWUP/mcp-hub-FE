// features/market/components/page/MarketPage.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import MarketGrid from "../grid/MarketGrid";
import { DUMMY_MCP_LIST } from "@/features/market/data";
import { getTitleByCategory } from "@/features/market/utils";
import type { CategoryId } from "@/features/market/constants";

// ✅ 헤더 컴포넌트
const MarketHeader: React.FC<{ title: string; count?: number }> = ({ title, count }) => (
    <header className="mb-6">
        <h1 className="text-title1 font-semibold">{title}</h1>
        {typeof count === "number" && (
            <p className="mt-1 text-body3 text-secondary">
                {count.toLocaleString()} results
            </p>
        )}
    </header>
);

export default function MarketPage() {
    const sp = useSearchParams();
    const cat = (sp.get("cat") ?? "all") as CategoryId;

    const items = React.useMemo(
        () => (cat === "all" ? DUMMY_MCP_LIST : DUMMY_MCP_LIST.filter(i => i.category === cat)),
        [cat]
    );

    return (
        <section>
            <MarketHeader title={getTitleByCategory(cat)} count={items.length} />
            <MarketGrid items={items} />
        </section>
    );
}
