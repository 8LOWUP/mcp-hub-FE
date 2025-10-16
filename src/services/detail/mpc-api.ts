// src/services/detail/mpc-api.ts
import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";

/** 서버 result에 여러 형태로 올 수 있는 platformId를 문자열로 안전 추출 */
const extractPlatformId = (raw: unknown): string | undefined => {
    const r = raw as any;
    const pid =
        r?.platformId ??
        r?.platform?.id ??
        r?.platform_id ??
        r?.platformCode ??
        r?.platform_code ??
        undefined;
    return pid != null ? String(pid) : undefined;
};

/** ✅ MCP 상세 조회 API (platformId를 문자열로 매핑해서 반환) */
export const getMcpDetail = async (
    mcpId: number
): Promise<getMcpDetailResponse["result"] & { platformId?: string }> => {
    const url = API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", String(mcpId));

    const response = await axiosInstance.get<getMcpDetailResponse>(url);
    const raw = response.data?.result;
    if (!raw) {
        console.warn("⚠️ MCP 상세 응답에 result가 없습니다:", response.data);
        throw new Error("❌ 서버 응답에 result가 없습니다.");
    }

    const platformId = extractPlatformId(raw);

    return {
        ...raw,
        platformId, // ✅ 항상 string | undefined
    };
};
