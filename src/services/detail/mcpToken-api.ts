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
export const getMcpTokenCheck = async (
    mcpId: number
): Promise<getMcpTokenCheckResponse> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN_CHECK.replace(
        "{mcpId}",
        String(mcpId)
    );

    console.log(`🔎 [GET] MCP 토큰 확인 요청 → ${url}`);

    try {
        const res = await axiosInstance.get<getMcpTokenCheckResponse>(url);
        console.log("✅ [GET] MCP 토큰 확인 성공:", res.data);
        return res.data;
    } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 400) {
            console.warn("⚠️ [GET] MCP 토큰 미등록 상태:", data);
            return data as getMcpTokenCheckResponse;
        }

        console.error(`❌ [GET] MCP 토큰 확인 실패 [${status ?? "Unknown"}]:`, data ?? error);
        throw error;
    }
};

/* -------------------------------------------------------------------------- */
/* ✅ MCP 토큰 등록 / 변경 (POST /workspaces/mcps/token/{platformId})          */
/* -------------------------------------------------------------------------- */
export const postMcpToken = async (
    platformId: string,
    body: postMcpTokenRequestBody
): Promise<postMcpTokenResponse> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        platformId
    );

    console.log(`🚀 [POST] MCP 토큰 등록 요청 → ${url}`, body);

    try {
        const res = await axiosInstance.post<postMcpTokenResponse>(url, body);
        console.log("✅ [POST] MCP 토큰 등록 성공:", res.data);
        return res.data;
    } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error(`❌ [POST] MCP 토큰 등록 실패 [${status ?? "Unknown"}]:`, data ?? error);
        throw error;
    }
};
