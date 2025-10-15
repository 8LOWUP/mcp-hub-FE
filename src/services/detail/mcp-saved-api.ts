import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { postMcpSaveResponse } from "@/types/detail/detail-types";

/**
 * MCP 저장(구매) API
 * POST /mcps/{mcpId}
 */
export const postMcpSave = async (
    mcpId: number
): Promise<postMcpSaveResponse> => {
    const url = API_ENDPOINTS.MCP.SAVE.replace("{mcpId}", String(mcpId));
    console.log("📡 MCP 저장 요청 URL:", url);

    try {
        const response = await axiosInstance.post<postMcpSaveResponse>(url);
        console.log("✅ MCP 저장 응답:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ MCP 저장 실패:", error);
        throw error;
    }
};
