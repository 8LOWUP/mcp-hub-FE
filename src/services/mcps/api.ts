import { axiosInstance } from "@/services/AxiosInstance";
import type { McpMetaType } from "@/types/mcps";

/** =========================
 *  상세 조회 타입 (스웨거 기반)
 *  ========================= */
export type MyUploadMcpDetail = {
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
    publishedAt?: string;
    lastPublishedAt?: string;
    tools?: { id: number; name: string; content: string }[];
    published?: boolean;
};

/** ✅ multipart/form-data 로 메타데이터 PATCH */
export const patchMcpDashboardMeta = async (meta: McpMetaType) => {
    const { file, ...metaOnly } = meta;

    const fd = new FormData();

    // 파일이 있으면 추가 (스웨거: file = binary)
    if (file instanceof File) {
        fd.append("file", file); // 필드명: "file"
    }

    // 메타데이터 JSON (스웨거: meta = object)
    // 서버가 @RequestPart("meta")로 받는 케이스
    fd.append("meta", new Blob([JSON.stringify(metaOnly)], { type: "application/json" }));
    // ※ 서버가 순수 문자열만 받으면 아래로 교체:
    // fd.append("meta", JSON.stringify(metaOnly));

    const { data } = await axiosInstance.patch("/mcps/dashboard/meta", fd);
    // 응답: { timestamp, code, message, result }
    return data;
};

/** ✅ 업로드 MCP 상세 조회 (스웨거 실제 경로) */
const MCP_DETAIL_PATH = (mcpId: number) => `/mcps/dashboard/${mcpId}`;

export const getMcpMetaById = async (mcpId: number): Promise<Partial<McpMetaType> & { id?: number }> => {
    const { data } = await axiosInstance.get(MCP_DETAIL_PATH(mcpId));
    const raw = data?.result ?? data;

    return {
        id: raw?.id,
        mcpId: raw?.id ?? mcpId,
        name: raw?.name ?? "",
        description: raw?.description ?? "",
        categoryId: raw?.categoryId,
        sourceUrl: raw?.sourceUrl,
        imageUrl: raw?.imageUrl,
        requestUrl: raw?.requestUrl,
        platformName: raw?.platformName,
        developerName: raw?.developerName,
        isKeyRequired: raw?.isKeyRequired,
        licenseId: raw?.licenseId,
        tools: raw?.tools,
    };
};

/** ✅ 플랫폼 문자열 목록 (자동완성/검증용) */
export const getPlatforms = async (): Promise<string[]> => {
    const { data } = await axiosInstance.patch("/mcps/dashboard/platform");
    return data?.result ?? [];
};
