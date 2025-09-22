// app/[locale]/market/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import MarketGrid from "@/features/market/components/grid/MarketGrid";
import { DUMMY_MCP_LIST } from "@/features/market/data";
import type { CategoryId } from "@/features/market/constants";

export default function MarketPage() {
    const sp = useSearchParams();
    const cat = (sp.get("cat") ?? "all") as CategoryId;

    const items = cat === "all" ? DUMMY_MCP_LIST : DUMMY_MCP_LIST.filter(i => i.category === cat);

    return <MarketGrid items={items} />;
}
