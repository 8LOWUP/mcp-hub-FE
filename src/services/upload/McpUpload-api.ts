import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { McpMetaRequestFormData, McpMetaResponse } from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 공통 유틸: undefined / null 키 제거                                        */
/* -------------------------------------------------------------------------- */
const cleanObject = <T extends object>(obj: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
    ) as Partial<T>;
};

/* -------------------------------------------------------------------------- */
/* 1) MCP 메타데이터 저장 (PATCH /mcps/dashboard/meta)                         */
/* -------------------------------------------------------------------------- */
export const saveMcpMeta = async (body: McpMetaRequestFormData): Promise<McpMetaResponse> => {
    const formData = new FormData();

    if (body.file instanceof File) {
        formData.append("file", body.file);
    } else {
        formData.append("file", new Blob([], { type: "application/octet-stream" }), "empty.txt");
    }

    const cleanedMeta = cleanObject(body.meta);
    formData.append("meta", new Blob([JSON.stringify(cleanedMeta)], { type: "application/json" }));

    const { data } = await axiosInstance.patch<McpMetaResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_META,
        formData
    );

    return data;
};

/* -------------------------------------------------------------------------- */
/* 2) MCP 배포 (PATCH /mcps/dashboard/publish, multipart)                       */
/*    - meta.mcpId 필수                                                        */
/*    - file 미선택 시 빈 Blob 첨부                                            */
/* -------------------------------------------------------------------------- */
export const publishMcp = async (body: McpMetaRequestFormData): Promise<McpMetaResponse> => {
    const { meta, file } = body;
    const id = Number(meta?.mcpId);
    if (!Number.isFinite(id) || id <= 0) {
        throw new Error("publishMcp: meta.mcpId가 필요합니다.");
    }

    const formData = new FormData();

    if (file instanceof File) {
        formData.append("file", file);
    } else {
        formData.append("file", new Blob([], { type: "application/octet-stream" }), "empty.txt");
    }

    const cleanedMeta = cleanObject(meta);
    formData.append("meta", new Blob([JSON.stringify(cleanedMeta)], { type: "application/json" }));

    try {
        const { data } = await axiosInstance.patch<McpMetaResponse>(
            API_ENDPOINTS.MCP.DASHBOARD_PUBLISH,
            formData
        );
        return data;
    } catch (err: any) {
        const status = err?.response?.status;
        const payload = err?.response?.data;
        // eslint-disable-next-line no-console
        console.error("[publishMcp] ✗ failed", { status, payload, id, cleanedMeta });
        throw new Error(payload?.message || `배포 실패 (status=${status})`);
    }
};

/* -------------------------------------------------------------------------- */
/* Export                                                                      */
/* -------------------------------------------------------------------------- */
export const mcpUploadApi = {
    saveMcpMeta,
    publishMcp,
};

export default mcpUploadApi;
