"use client";

import { useQuery } from "@tanstack/react-query";
import { getMcpDetail } from "@/services/detail/mpc-api";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";


// ✅ MCP 상세 조회 훅

export const useMarketDetail = (mcpId: number) => {
    return useQuery<getMcpDetailResponse["result"]>({
        queryKey: ["mcpDetail", mcpId],
        queryFn: () => getMcpDetail(mcpId),
        enabled: !!mcpId,
    });
};
