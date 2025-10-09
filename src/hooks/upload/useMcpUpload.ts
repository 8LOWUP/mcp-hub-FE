import { useMutation } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type { McpMetaRequestFormData, McpMetaResponse } from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 메타데이터 임시 저장 훅 (multipart/form-data)                        */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 임시 저장하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/meta
 *
 * ✅ 사용 예시:
 * const saveMeta = useSaveMcpMeta();
 * await saveMeta.mutateAsync({ file: null, meta });
 */
export const useSaveMcpMeta = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["saveMcpMeta"],

        mutationFn: async (body) => {
            console.log("🧩 [useSaveMcpMeta] 요청 시작:", {
                file: body.meta.imageUrl,
                meta: body.meta,
            });

            // ✅ multipart/form-data는 API 내부에서 자동 처리됨
            return await mcpUploadApi.saveMcpMeta(body);
        },

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
/* 🚀 MCP 배포 훅 (multipart/form-data)                                        */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 배포하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/publish
 *
 * ✅ 사용 예시:
 * const publish = usePublishMcp();
 * await publish.mutateAsync({ file: null, meta });
 */
export const usePublishMcp = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["publishMcp"],

        mutationFn: async (body) => {
            console.log("🚀 [usePublishMcp] 요청 시작:", {
                file: body.meta.imageUrl,
                meta: body.meta,
            });

            return await mcpUploadApi.publishMcp(body);
        },

        onSuccess: (data) => {
            if (data.code === "SUCCESS") {
                console.log("✅ MCP 배포 완료");
            } else {
                console.warn("⚠️ MCP 배포 실패:", data.message);
            }
        },

        onError: (error) => {
            console.error("❌ MCP 배포 중 오류:", error);
        },
    });
};
