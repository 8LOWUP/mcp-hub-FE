"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getMcpTokenCheck, postMcpToken } from "@/services/detail/mcpToken-api";
import type {
    getMcpTokenCheckResponse,
    postMcpTokenRequestBody,
    postMcpTokenResponse,
} from "@/types/detail/detail-types";
import { toast } from "sonner";
import {useLoginStore} from "@/store/login/login-store";

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 존재 여부 확인 훅 (GET /workspaces/mcps/token/check/{mcpId})    */
/* -------------------------------------------------------------------------- */

/**
 * 사용자의 MCP 토큰이 존재하는지 확인하는 훅
 */
export const useCheckMcpToken = (mcpId: number) => {
    const { isLoggedIn } = useLoginStore();
    return useQuery<getMcpTokenCheckResponse>({
        queryKey: ["mcp-token-check", mcpId],
        queryFn: async () => await getMcpTokenCheck(mcpId),
        enabled: !!mcpId && isLoggedIn, // mcpId가 있을 때만 실행
        retry: false,
    });
};

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 등록 / 변경 훅 (POST /workspaces/mcps/token/{platformId})       */
/* -------------------------------------------------------------------------- */

/**
 * 사용자의 MCP 토큰을 등록하거나 변경하는 훅
 */
export const usePostMcpToken = () => {
    return useMutation<postMcpTokenResponse, Error, { platformId: string; body: postMcpTokenRequestBody }>({
        mutationFn: async ({ platformId, body }) => {
            return await postMcpToken(platformId, body);
        },
        onSuccess: (data) => {
            toast.success("MCP 토큰이 성공적으로 등록되었습니다!");
            console.log("🎉 MCP 토큰 등록 성공:", data);
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("⚠️ 저장되지 않은 MCP에 대한 요청입니다.");
            } else {
                toast.error("❌ MCP 토큰 등록에 실패했습니다.");
            }
            console.error("MCP 토큰 등록 오류:", error);
        },
    });
};
