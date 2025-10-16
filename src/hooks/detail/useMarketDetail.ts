// src/hooks/detail/useMarketDetail.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMcpDetail } from "@/services/detail/mpc-api";

// ✅ getMcpDetail의 실제 반환 타입을 그대로 사용
export type MarketDetailType = Awaited<ReturnType<typeof getMcpDetail>>;

export const useMarketDetail = (mcpId: number) => {
    return useQuery<MarketDetailType>({
        queryKey: ["mcpDetail", mcpId], // 필요하면 ["mcp","detail", mcpId]로 통일
        queryFn: () => getMcpDetail(mcpId),
        enabled: !!mcpId,
    });
};
