// features/market/components/grid/MarketGrid.tsx
"use client";

import React from "react";
import MarketMCPCard from "../MarketMCPCard";

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

const GRID = "grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full mx-auto ";
const GRID_1 = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto";

const MarketGrid: React.FC<Props> = ({ items }) => {
    
    if (!items?.length) {
        return <div className="text-secondary">No results</div>;
    }

    return (
        <section className={items.length === 1 ? GRID_1 : GRID}>
            {items.map((item) => (
                <MarketMCPCard 
                    key={item.id} 
                    {...item} 
                    className={items.length === 1 ? "w-[300px]" : ""}
                />
            ))}
        </section>
    );
};

export default MarketGrid;
