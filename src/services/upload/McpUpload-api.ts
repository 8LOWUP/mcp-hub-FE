import { axiosInstance } from "@/services/AxiosInstance";
import type {
    FileUploadRequest,
    FileUploadResponse,
    McpMetaRequest,
    McpMetaResponse,
} from "@/types/upload/upload-types";

/* ----------------------------- 파일 업로드 ----------------------------- */

export const uploadFile = async ({
                                     category,
                                     file,
                                 }: FileUploadRequest): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post<FileUploadResponse>(
        `/file/${category}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return data;
};

/* ---------------------------- MCP 메타데이터 ---------------------------- */

export const saveMcpMeta = async (
    body: McpMetaRequest
): Promise<McpMetaResponse> => {
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        "/mcps/dashboard/meta",
        body
    );
    return data;
};

export const publishMcp = async (
    body: McpMetaRequest
): Promise<McpMetaResponse> => {
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        "/mcps/dashboard/publish",
        body
    );
    return data;
};

/* ------------------------------- 통합 객체 ------------------------------ */

export const mcpUploadApi = {
    uploadFile,
    saveMcpMeta,
    publishMcp,
};

export default mcpUploadApi;
