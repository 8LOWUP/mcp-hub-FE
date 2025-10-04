import { useMutation } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type {
    FileUploadRequest,
    FileUploadResponse,
    McpMetaRequest,
    McpMetaResponse,
} from "@/types/upload/upload-types";

/* ----------------------------- 파일 업로드 ----------------------------- */
export const useUploadFile = () => {
    return useMutation<FileUploadResponse, Error, FileUploadRequest>({
        mutationFn: (params) => mcpUploadApi.uploadFile(params),
    });
};

/* ---------------------------- MCP 임시저장 ---------------------------- */
export const useSaveMcpMeta = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequest>({
        mutationFn: (body) => mcpUploadApi.saveMcpMeta(body),
    });
};

/* ----------------------------- MCP 배포 ----------------------------- */
export const usePublishMcp = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequest>({
        mutationFn: (body) => mcpUploadApi.publishMcp(body),
    });
};
