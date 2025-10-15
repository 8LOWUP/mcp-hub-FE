// src/features/profiles/deployed/apis/mcp.ts
import { axiosInstance } from "@/services/AxiosInstance";
import {
    UploadedMcpItemType,
    UploadedMcpPageType,
    UploadedMcpQueryType,
} from "../types/mcps";

/* ------------------------------
 * 서버 응답(raw) 타입
 * ------------------------------ */
type ServerDashboardItem = {
    id: number;
    name: string;
    version?: string;
    description?: string;
    imageUrl?: string;
    requestUrl?: string;
    sourceUrl?: string;
    developerName?: string;
    isKeyRequired?: boolean;
    categoryId?: number;
    categoryName?: string;
    platformId?: number;
    platformName?: string;
    licenseId?: number;
    licenseName?: string;
    averageRating?: number;
    savedUserCount?: number;
    publishedDate?: string | null;
    lastPublishedAt?: string | null;
    published?: boolean;
};

type ServerDashboardPage = {
    content: ServerDashboardItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty?: boolean;
};

/** 서버가 { result: ... }로 감싸도 안전하게 처리 */
const normalize = <T>(raw: unknown): T => {
    if (raw == null) return raw as T;
    if (typeof raw === "object") {
        const r = raw as Record<string, unknown>;
        return ("result" in r ? (r["result"] as T) : (raw as T));
    }
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            return ("result" in parsed ? (parsed["result"] as T) : (parsed as T));
        } catch {
            return raw as T;
        }
    }
    return raw as T;
};

/** 서버 아이템 → 앱에서 쓰는 아이템 타입으로 변환 */
const toUploadedMcpItem = (it: ServerDashboardItem): UploadedMcpItemType => ({
    id: it.id,
    name: it.name,
    description: it.description,
    imageUrl: it.imageUrl,
    requestUrl: it.requestUrl,
    sourceUrl: it.sourceUrl,
    developerName: it.developerName,
    categoryId: it.categoryId,
    categoryName: it.categoryName,
    platformId: it.platformId,
    platformName: it.platformName,
    licenseId: it.licenseId,
    licenseName: it.licenseName,
    averageRating: it.averageRating,
    savedUserCount: it.savedUserCount,
    publishedDate: it.publishedDate ?? null,
    lastPublishedAt: it.lastPublishedAt ?? null,
    published: it.published,
});

/* ------------------------------
 * GET /mcps/dashboard : 내 업로드 MCP 리스트 조회
 * ------------------------------ */
export const fetchMyUploadedMcps = async (
    query: UploadedMcpQueryType
): Promise<UploadedMcpPageType> => {
    const params: Record<string, any> = {
        page: query.page ?? 0,
        size: query.size ?? 12,
        sort: query.sort ?? "publishedDate,desc",
        search: query.search ?? "",
    };
    if (query.category !== "" && query.category != null) {
        params.category = query.category;
    }

    const { data } = await axiosInstance.get("/mcps/dashboard", { params });
    const page = normalize<ServerDashboardPage>(data);

    return {
        content: (page.content ?? []).map(toUploadedMcpItem),
        totalElements: page.totalElements ?? 0,
        totalPages: page.totalPages ?? 0,
        number: page.number ?? (query.page ?? 0),
        size: page.size ?? (query.size ?? 12),
        first: !!page.first,
        last: !!page.last,
    };
};

/* ------------------------------
 * DELETE /mcps/dashboard/{mcpId} : 업로드한 MCP 삭제
 * ------------------------------ */
type ApiEnvelope<T> = {
    timestamp: string;
    code: string;
    message: string;
    result: T;
};

export const deleteMyUploadedMcp = async (mcpId: string | number) => {
    const { data } = await axiosInstance.delete<ApiEnvelope<number>>(
        `/mcps/dashboard/${mcpId}`
    );
    return data; // { timestamp, code, message, result }
};


const mcpApi = { fetchMyUploadedMcps, deleteMyUploadedMcp };
export default mcpApi;
