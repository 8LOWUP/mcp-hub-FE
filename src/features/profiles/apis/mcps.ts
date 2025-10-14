import { axiosInstance } from "@/services/AxiosInstance";
import type { McpItemType, PageRequestType, PageResponseType } from "../types/mcps";

/* ================================
 * 서버 원본 타입 (응답 스키마)
 * ================================ */
type ServerMcpItem = {
    id: number;                 // ✅ 서버는 number 보장
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
    id: String(raw.id),                 // FE는 string id
    mcpId: raw.id,                      // 필요시 숫자 id도 보관
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

/* ================================
 * GET /mcps/me
 * ================================ */
export const fetchMyMcps = async (
    params: PageRequestType = { page: 0, size: 12 }
): Promise<PageResponseType<McpItemType>> => {
    const query = {
        page: params.page ?? 0,
        size: params.size ?? 12,
        sort: params.sort,
        search: params.search,
    };

    try {
        const { data } = await axiosInstance.get("/mcps/me", { params: query });
        const page = unwrap<ServerPage<ServerMcpItem>>(data);

        return {
            content: (page.content ?? []).map(adaptItem),
            totalElements: page.totalElements ?? 0,
            totalPages: page.totalPages ?? 0,
            number: page.number ?? (query.page ?? 0),
            size: page.size ?? (query.size ?? 12),
        };
    } catch (error: any) {
        // 서버가 특이하게 request 문자열을 요구하는 환경일 때만 사용 (옵션)
        // if (error?.response?.status === 400) {
        //   const request = JSON.stringify(query);
        //   const { data } = await axiosInstance.get("/mcps/me", { params: { request } });
        //   const page = unwrap<ServerPage<ServerMcpItem>>(data);
        //   return {
        //     content: (page.content ?? []).map(adaptItem),
        //     totalElements: page.totalElements ?? 0,
        //     totalPages: page.totalPages ?? 0,
        //     number: page.number ?? (query.page ?? 0),
        //     size: page.size ?? (query.size ?? 12),
        //   };
        // }

        // eslint-disable-next-line no-console
        console.error("[fetchMyMcps] 요청 실패:", error);
        if (error?.response?.status === 401) {
            throw new Error("로그인이 필요합니다. 다시 로그인 후 시도해 주세요.");
        }
        throw new Error("내 MCP 리스트를 불러오지 못했습니다.");
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
        // 200 OK, 204 No Content 모두 성공으로 처리
        if (res.status >= 200 && res.status < 300) return true;

        // 혹시나 커스텀 래핑 응답을 쓰는 경우
        const data = unwrap<any>(res.data);
        // data.code === 'SUCCESS' 등 추가 규칙이 있다면 여기서 검사
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
