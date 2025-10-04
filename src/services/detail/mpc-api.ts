import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";

// ✅ MCP 상세 조회 API
export const getMcpDetail = async (
    mcpId: number
): Promise<getMcpDetailResponse["result"]> => {
    const url = API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", String(mcpId));
    console.log("📡 MCP 상세 요청 URL:", url);

    const response = await axiosInstance.get<getMcpDetailResponse>(url);
    console.log("✅ MCP 상세 전체 응답:", response.data);

    if (!response.data?.result) {
        throw new Error("❌ MCP 상세 응답에 result가 없습니다.");
    }

    return response.data.result;
};
