// src/features/profiles/deployed/apis/mcp.ts
import { axiosInstance } from "@/services/AxiosInstance";
import {
    McpItemType,
    PageRequestType,
    PageResponseType,
} from "@/features/profiles/types/mcps";

/** 서버 응답(raw) 타입 – 필요한 필드만 선언 */
type ServerDashboardItem = {
    id: number;
    name: string;
    version: string;
    description: string;
    imageUrl: string;
    isKeyRequired: boolean;
    categoryName: string;
    platformName: string;
    licenseName: string;
    averageRating: number;
    savedUserCount: number;
    publishedDate: string; // ISO
};

type ServerDashboardPage = {
    content: ServerDashboardItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};

type DashboardQuery = PageRequestType & {
    category?: string;
    // sort 예: "publishedDate,desc" (기본값은 아래에서 넣어줌)
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

/** 서버 아이템 → 카드 컴포넌트 아이템으로 변환 */
const convertDashboardItemToMcpItem = (it: ServerDashboardItem): McpItemType => ({
    id: String(it.id),           // number → string
    title: it.name,              // UI는 title 사용 → name 매핑
    name: it.name,
    version: it.version,
    description: it.description,
    imageUrl: it.imageUrl,
    categoryName: it.categoryName,
    platformName: it.platformName,
    licenseName: it.licenseName,
    createdAt: it.publishedDate, // createdAt ← publishedDate
    apiKey: undefined,           // 대시보드 응답엔 없음(모달에서 따로 주입)
});

/** GET /mcps/dashboard : 내 업로드 MCP 리스트 조회 */
export const fetchMyUploadedMcps = async (
    query: DashboardQuery
): Promise<PageResponseType<McpItemType>> => {
    const params = {
        page: query.page ?? 0,
        size: query.size ?? 12,
        sort: query.sort ?? "publishedDate,desc",
        category: query.category ?? "",
        search: query.search ?? "",
    };

    const { data } = await axiosInstance.get("/mcps/dashboard", { params });
    const page = normalize<ServerDashboardPage>(data);

    return {
        ...page,
        content: (page.content ?? []).map(convertDashboardItemToMcpItem),
    };
};
