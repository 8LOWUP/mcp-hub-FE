// app/[locale]/market/page.tsx
import MarketGrid, { MCPCardData } from "@/features/market/components/grid/MarketGrid";

const mockItems: MCPCardData[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `mcp-${i + 1}`,
    title: `Creative Text Generator ${i + 1}`,
    description: "seolimyoung blahblahblah",
    saved: i % 2 === 0,
    usersCount: 1000,
    iconSrc: "/mcpLogo.svg",
}));

export default function MarketPage() {
    return <MarketGrid items={mockItems} />;
}
