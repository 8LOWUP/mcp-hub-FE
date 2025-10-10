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
    title: raw.name,              // ✅ UI 계약: title 필요 → name 매핑
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
        throw new Error("내 MCP 리스트를 불러오지 못했습니다.");
    }
};
