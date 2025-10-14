// src/api/detail/mcpToken-api.ts
import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type {
    getMcpTokenCheckResponse,
    postMcpTokenRequestBody,
    postMcpTokenResponse,
} from "@/types/detail/detail-types";

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 존재 여부 확인 (GET /workspaces/mcps/token/check/{mcpId})       */
/* -------------------------------------------------------------------------- */

/**
 * 사용자의 MCP 토큰이 이미 등록되어 있는지 확인하는 API
 * 200 또는 400 모두 유효한 응답 구조를 반환함
 */
export const getMcpTokenCheck = async (
    mcpId: number
): Promise<getMcpTokenCheckResponse> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN_CHECK.replace(
        "{mcpId}",
        String(mcpId)
    );
    console.log("📡 MCP 토큰 확인 요청:", url);

    try {
        const res = await axiosInstance.get<getMcpTokenCheckResponse>(url);
        console.log("✅ MCP 토큰 확인 성공:", res.data);
        return res.data;
    } catch (error: any) {
        // ⚠️ 400 응답도 정상적으로 result가 포함됨
        if (error.response?.status === 400) {
            console.warn("⚠️ MCP 토큰 미등록 상태:", error.response.data);
            return error.response.data as getMcpTokenCheckResponse;
        }
        console.error("❌ MCP 토큰 확인 실패:", error);
        throw error;
    }
};

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 등록 / 변경 (POST /workspaces/mcps/token/{platformId})          */
/* -------------------------------------------------------------------------- */

/**
 * 사용자의 MCP 토큰을 등록하거나 수정하는 API
 */
export const postMcpToken = async (
    platformId: string,
    body: postMcpTokenRequestBody
): Promise<postMcpTokenResponse> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        platformId
    );
    console.log("📡 MCP 토큰 등록 요청:", url, body);

    try {
        const res = await axiosInstance.post<postMcpTokenResponse>(url, body);
        console.log("✅ MCP 토큰 등록 성공:", res.data);
        return res.data;
    } catch (error: any) {
        console.error("❌ MCP 토큰 등록 실패:", error);
        throw error;
    }
};
