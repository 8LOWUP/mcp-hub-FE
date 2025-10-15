import { axiosInstance } from "@/services/AxiosInstance";
import type { McpItemType, PageRequestType, PageResponseType } from "../types/mcps";

/* ================================
 * 서버 원본 타입 (응답 스키마)
 * ================================ */
type ServerMcpItem = {
    id: number;
    name: string;
    version?: string;
    description?: string;
    imageUrl?: string;
    categoryName?: string;
    platformName?: string;
    licenseName?: string;
    createdAt?: string;
    apiKey?: string | null;
};

type ServerPage<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // 현재 페이지(0-base)
    size: number;
};

/* 서버가 { result: ... }로 래핑해 보내는 경우 제거 */
const unwrap = <T>(raw: any): T => {
    if (raw && typeof raw === "object" && "result" in raw) return raw.result as T;
    return raw as T;
};

/* 서버 → UI 매핑 */
const adaptItem = (raw: ServerMcpItem): McpItemType => ({
    id: String(raw.id),
    mcpId: raw.id,
    title: raw.name ?? "",
    name: raw.name ?? "",
    version: raw.version ?? "",
    description: raw.description ?? "",
    imageUrl: raw.imageUrl ?? "",
    categoryName: raw.categoryName ?? "",
    platformName: raw.platformName ?? "",
    licenseName: raw.licenseName ?? "",
    createdAt: raw.createdAt ?? "",
    apiKey: raw.apiKey ?? undefined,
});

/** 빈 값 제외 유틸 */
const compactParams = (obj: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return;
        out[k] = typeof v === "string" ? v.trim() : v;
    });
    return out;
};

/* ================================
 * GET /mcps/me
 * ================================ */
export const fetchMyMcps = async (
    params: PageRequestType = { page: 0, size: 12 }
): Promise<PageResponseType<McpItemType>> => {
    // 🔴 sort 미지원 → 전송하지 않음
    const baseQuery = {
        page: params.page ?? 0,
        size: params.size ?? 12,
        // sort: params.sort, // 미지원
        search: params.search,
    };
    const query = compactParams(baseQuery);

    try {
        const { data, status } = await axiosInstance.get("/mcps/me", { params: query });

        // 204(No Content)도 방어
        if (status === 204 || data == null) {
            return {
                content: [],
                totalElements: 0,
                totalPages: 0,
                number: (query.page as number) ?? 0,
                size: (query.size as number) ?? 12,
            };
        }

        const page = unwrap<ServerPage<ServerMcpItem>>(data);

        return {
            content: (page.content ?? []).map(adaptItem),
            totalElements: page.totalElements ?? 0,
            totalPages: page.totalPages ?? 0,
            number: page.number ?? (query.page as number) ?? 0,
            size: page.size ?? (query.size as number) ?? 12,
        };
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error("[fetchMyMcps] 요청 실패:", error);

        const serverMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message;

        if (error?.response?.status === 401) {
            throw new Error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
        }
        if (error?.response?.status >= 500) {
            throw new Error(serverMsg || "서버 내부 오류로 내 MCP 리스트를 불러오지 못했습니다.");
        }
        throw new Error(serverMsg || "내 MCP 리스트를 불러오지 못했습니다.");
    }
};

/* ================================
 * DELETE /mcps/{mcpId}
 * ================================ */
export const deleteMyMcp = async (mcpId: string | number): Promise<boolean> => {
    const id = Number(mcpId);
    if (Number.isNaN(id)) throw new Error("유효하지 않은 MCP ID");

    try {
        const res = await axiosInstance.delete(`/mcps/${id}`);
        // 200~299 성공 처리
        if (res.status >= 200 && res.status < 300) return true;

        // 커스텀 래핑 응답까지 고려
        unwrap<any>(res.data);
        return true;
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error("[deleteMyMcp] ❌ MCP 삭제 실패:", error);
        const serverMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message;

        if (error?.response?.status === 404) {
            throw new Error("해당 MCP가 존재하지 않습니다.");
        }
        if (error?.response?.status === 401) {
            throw new Error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
        }
        throw new Error(serverMsg || "MCP 삭제에 실패했습니다.");
    }
};
