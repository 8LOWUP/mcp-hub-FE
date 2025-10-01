import { axiosInstance } from "../AxiosInstance";
import {
    DraftResponse,
    FileUploadResponse,
    McpMetaPayload,
} from "@/types/upload/upload-types";

// ✅ Upload 전용 API 엔드포인트
const API_ENDPOINTS = {
    MCP: {
        DASHBOARD: "/mcps/dashboard", // Draft 생성
        META: (mcpId: number) => `/mcps/dashboard/${mcpId}/meta`, // 메타 저장
        PUBLISH: (mcpId: number) => `/mcps/dashboard/${mcpId}/publish`, // 배포
    },
    FILES: {
        UPLOAD: (category: string) => `/files/${category}`, // 파일 업로드
    },
};

// ✅ Draft 생성 (mcpId 반환)
export const createMcpDraft = async (): Promise<number> => {
    const res = await axiosInstance.post<DraftResponse>(API_ENDPOINTS.MCP.DASHBOARD, {});
    return res.data.result;
};

// ✅ 파일 업로드 → URL 반환
export const uploadFile = async (
    category: string,
    file: File
): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post<FileUploadResponse>(
        API_ENDPOINTS.FILES.UPLOAD(category),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.result.url;
};

// ✅ MCP 메타데이터 저장 (임시 저장)
export const saveMcpMeta = async (
    mcpId: number,
    payload: McpMetaPayload
): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.MCP.META(mcpId), payload);
};

// ✅ MCP 배포
export const publishMcp = async (mcpId: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.MCP.PUBLISH(mcpId), { publish: true });
};
