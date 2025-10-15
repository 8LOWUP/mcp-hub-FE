// src/hooks/detail/useMcpToken.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getMcpTokenCheckResponse,
    postMcpTokenRequestBody,
    postMcpTokenResponse,
} from "@/types/detail/detail-types";
import { getMcpTokenCheck, postMcpToken } from "@/services/detail/mcpToken-api";

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 존재 여부 확인 (GET)                                            */
/* -------------------------------------------------------------------------- */
/**
 * @description
 * MCP ID를 기반으로 현재 사용자가 MCP 토큰을 이미 등록했는지 확인하는 훅입니다.
 * - 200, 400 모두 정상 흐름으로 간주합니다.
 * - `data.result.isTokenExist`로 토큰 존재 여부 확인
 */
export function useCheckMcpToken(mcpId: number) {
    return useQuery<getMcpTokenCheckResponse>({
        queryKey: ["mcp-token-check", mcpId],
        queryFn: () => getMcpTokenCheck(mcpId),
        enabled: !!mcpId, // mcpId가 유효할 때만 실행
        retry: false, // 400도 정상 응답으로 처리
    });
}

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 등록 / 변경 (POST)                                              */
/* -------------------------------------------------------------------------- */
/**
 * @description
 * 사용자의 MCP 토큰을 등록하거나 변경하는 훅입니다.
 * - `mutate({ platformId, body })` 형태로 호출합니다.
 * - 성공 시 result.platformId 반환
 */
export function useUpdateMcpToken() {
    return useMutation<
        postMcpTokenResponse,
        Error,
        { platformId: string; body: postMcpTokenRequestBody }
    >({
        mutationFn: async ({ platformId, body }) => {
            return await postMcpToken(platformId, body);
        },
    });
}
