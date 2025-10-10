// src/features/profiles/apis/mcps.ts

import { axiosInstance } from "@/services/AxiosInstance";
import { McpItemType, PageRequestType, PageResponseType } from "../types/mcps";

/* 원본 서버 아이템(백엔드 스키마) */
type RawMcpItem = {
    id: number | string;
    name: string;
    version: string;
    description: string;
    imageUrl: string;
    categoryName: string;
    platformName: string;
    licenseName: string;
    createdAt: string;
    apiKey?: string | null;
};

type RawPage<T> = PageResponseType<T>;

/* 서버 → UI 계약으로 어댑트 */
const adapt = (raw: RawMcpItem): McpItemType => ({
    id: String(raw.id),
    title: raw.name, // UI 계약: title 필요 → name 매핑
    name: raw.name,
    version: raw.version,
    description: raw.description,
    imageUrl: raw.imageUrl,
    categoryName: raw.categoryName,
    platformName: raw.platformName,
    licenseName: raw.licenseName,
    createdAt: raw.createdAt,
    apiKey: raw.apiKey ?? undefined,
});

/* GET /mcps/me */
export const fetchMyMcps = async (
    params: PageRequestType = { page: 0, size: 12 }
): Promise<PageResponseType<McpItemType>> => {
    try {
        const { data } = await axiosInstance.get("/mcps/me", { params });
        const page: RawPage<RawMcpItem> = (data?.result ?? data) as RawPage<RawMcpItem>;
        return { ...page, content: page.content.map(adapt) };
    } catch (error: any) {
        if (error?.response?.status === 400) {
            const request = JSON.stringify({
                page: params.page ?? 0,
                size: params.size ?? 12,
                search: params.search ?? undefined,
                sort: params.sort ?? undefined,
            });
            const { data } = await axiosInstance.get("/mcps/me", { params: { request } });
            const page: RawPage<RawMcpItem> = (data?.result ?? data) as RawPage<RawMcpItem>;
            return { ...page, content: page.content.map(adapt) };
        }
        // eslint-disable-next-line no-console
        console.error("[fetchMyMcps] 요청 실패:", error);
        if (error?.response?.status === 401) {
            throw new Error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
        }
        throw new Error("내 MCP 리스트를 불러오지 못했습니다.");
    }
};

/* DELETE /mcps/{mcpId} */
export const deleteMyMcp = async (mcpId: string | number): Promise<boolean> => {
    try {
        const { data } = await axiosInstance.delete(`/mcps/${mcpId}`);
        // 서버가 { result, code, message } 래핑을 주더라도 성공이면 true로 반환
        // eslint-disable-next-line no-console
        console.log("[deleteMyMcp] ✅ MCP 삭제 성공:", data);
        return true;
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error("[deleteMyMcp] ❌ MCP 삭제 실패:", error);
        if (error?.response?.status === 404) {
            throw new Error("해당 MCP가 존재하지 않습니다.");
        }
        if (error?.response?.status === 401) {
            throw new Error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
        }
        throw new Error("MCP 삭제에 실패했습니다.");
    }
};
