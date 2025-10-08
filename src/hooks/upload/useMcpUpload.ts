import { useMutation } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type {
    FileUploadRequest,
    FileUploadResponse,
    McpMetaRequest,
    McpMetaResponse,
} from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 📂 파일 업로드 훅                                                          */
/* -------------------------------------------------------------------------- */
/**
 * Presigned URL 기반 S3 파일 업로드 훅
 * - Step 1️⃣ Presigned URL 발급 요청
 * - Step 2️⃣ S3에 파일 업로드 후 업로드된 파일 URL 반환
 *
 * ✅ 사용 예시:
 * const uploadFile = useUploadFile();
 * const result = await uploadFile.mutateAsync({ category: "mcp", file });
 */
export const useUploadFile = () => {
    return useMutation<FileUploadResponse, Error, FileUploadRequest>({
        mutationKey: ["uploadFile"],
        mutationFn: (params) => mcpUploadApi.uploadFile(params),
        onSuccess: (data) => {
            if (data.code !== "SUCCESS") {
                console.warn("⚠️ 파일 업로드 실패:", data.message);
            } else {
                console.log("✅ 파일 업로드 완료:", data.result.url);
            }
        },
        onError: (error) => {
            console.error("❌ 파일 업로드 중 오류 발생:", error);
        },
    });
};

/* -------------------------------------------------------------------------- */
/* 🗂 MCP 메타데이터 임시 저장 훅                                             */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 임시 저장하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/meta
 *
 * ✅ 사용 예시:
 * const saveMeta = useSaveMcpMeta();
 * await saveMeta.mutateAsync(metaData);
 */
export const useSaveMcpMeta = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequest>({
        mutationKey: ["saveMcpMeta"],
        mutationFn: (body) => mcpUploadApi.saveMcpMeta(body),
        onSuccess: (data) => {
            if (data.code === "SUCCESS") {
                console.log("✅ MCP 메타데이터 임시 저장 완료");
            } else {
                console.warn("⚠️ MCP 메타데이터 저장 실패:", data.message);
            }
        },
        onError: (error) => {
            console.error("❌ MCP 메타데이터 저장 중 오류:", error);
        },
    });
};

/* -------------------------------------------------------------------------- */
/* 🚀 MCP 배포 훅                                                             */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 배포하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/publish
 *
 * ✅ 사용 예시:
 * const publish = usePublishMcp();
 * await publish.mutateAsync(metaData);
 */
export const usePublishMcp = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequest>({
        mutationKey: ["publishMcp"],
        mutationFn: (body) => mcpUploadApi.publishMcp(body),
        onSuccess: (data) => {
            if (data.code === "SUCCESS") {
                console.log("🚀 MCP 배포 완료");
            } else {
                console.warn("⚠️ MCP 배포 실패:", data.message);
            }
        },
        onError: (error) => {
            console.error("❌ MCP 배포 중 오류:", error);
        },
    });
};
