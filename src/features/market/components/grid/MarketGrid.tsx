// features/market/components/grid/MarketGrid.tsx
"use client";

import React from "react";
import MCPCard from "@/components/container/McpCard";

export type MCPCardData = {
    id: string;
    title: string;
    description: string;
    iconSrc?: string;
    saved?: boolean;
    usersCount?: number;
    className?: string;
};

type Props = {
    items: MCPCardData[];
};

const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

const MarketGrid: React.FC<Props> = ({ items }) => {
    if (!items?.length) {
        return <div className="text-secondary">No results</div>;
    }

    return (
        <section className={GRID}>
            {items.map((item) => (
                <MCPCard key={item.id} {...item} />
            ))}
        </section>
    );
};

export default MarketGrid;
