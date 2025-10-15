// src/api/detail/mcpToken-api.ts

import { getMcpTokenCheckResponse, postMcpTokenRequestBody, postMcpTokenResponse } from "@/types/detail/detail-types";

/**
 * ✅ MCP 토큰 존재 여부 확인 API
 * GET /workspaces/mcps/token/check/{mcpId}
 *
 * 사용자의 MCP 토큰이 이미 등록되어 있는지 확인하는 API
 */
export const getMcpTokenCheck = async (mcpId: number): Promise<getMcpTokenCheckResponse> => {
    const res = await fetch(`/workspaces/mcps/token/check/${mcpId}`, {
        method: "GET",
    });

    // ⚠️ 200, 400 모두 유효한 결과로 간주 (result 구조 동일)
    const data = await res.json();

    if (!res.ok && res.status !== 400) {
        throw new Error(`토큰 확인 실패: ${res.status}`);
    }

    return data as getMcpTokenCheckResponse;
};

/**
 * ✅ MCP 토큰 등록 / 변경 API
 * POST /workspaces/mcps/token/{platformId}
 *
 * 사용자의 MCP 토큰을 등록하거나 수정하는 API
 */
export const postMcpToken = async (
    platformId: string,
    body: postMcpTokenRequestBody
): Promise<postMcpTokenResponse> => {
    const res = await fetch(`/workspaces/mcps/token/${platformId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`토큰 등록 실패: ${res.status}`);
    }

    return (await res.json()) as postMcpTokenResponse;
};
