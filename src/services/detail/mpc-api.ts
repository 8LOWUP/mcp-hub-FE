import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";

// ✅ MCP 상세 조회 API
export const getMcpDetail = async (
    mcpId: number
): Promise<getMcpDetailResponse["result"]> => {
    const url = API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", String(mcpId));
    try {
        const response = await axiosInstance.get<getMcpDetailResponse>(url);

        console.log("✅ MCP 상세 전체 응답:", response.data);

        if (!response.data?.result) {
            console.warn("⚠️ MCP 상세 응답에 result가 없습니다:", response.data);
            throw new Error("❌ 서버 응답에 result가 없습니다.");
        }

        console.log("📦 MCP 상세 데이터(result):", response.data.result);
        return response.data.result;
    } catch (error: any) {
        console.error("❌ MCP 상세 조회 실패:", error?.response || error);
        throw error;
    }
};
