import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { McpItem, ApiResponse } from "@/types/detail/detail-types";

// ✅ MCP 상세 조회 API
export const getMcpDetail = async (mcpId: string): Promise<McpItem> => {
    const url = API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", String(mcpId));
    console.log("📡 요청 URL:", url);

    const response = await axiosInstance.get<ApiResponse<McpItem>>(url);
    console.log("✅ 전체 응답:", response.data);

    if (!response.data?.result) {
        throw new Error("MCP 상세 응답에 result가 없습니다.");
    }

    return response.data.result;
};
