import { useMutation } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type {
    McpMetaRequestFormData,
    McpMetaResponse,
} from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 🧠 공통: 성공 코드 판정 유틸 함수                                           */
/* -------------------------------------------------------------------------- */
const isSuccessResponse = (code?: string) =>
    code === "SUCCESS" || code === "COMMON200" || code === "200";

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 메타데이터 임시 저장 훅 (PATCH /mcps/dashboard/meta)                 */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 임시 저장하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/meta
 *
 * ✅ 사용 예시:
 * const saveMeta = useSaveMcpMeta();
 * await saveMeta.mutateAsync({ file, meta });
 */
export const useSaveMcpMeta = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["saveMcpMeta"],

        // ✅ API 호출
        mutationFn: async (body) => {
            console.log("🧩 [useSaveMcpMeta] 요청 시작:", {
                file: body.file instanceof File ? body.file.name : "empty",
                meta: body.meta,
            });

            // API 내부에서 FormData 생성 및 cleanObject 처리됨
            return await mcpUploadApi.saveMcpMeta(body);
        },

        // ✅ 성공 콜백
        onSuccess: (data) => {
            if (isSuccessResponse(data.code)) {
                console.log("✅ MCP 메타데이터 임시 저장 완료:", data);
            } else {
                console.warn("⚠️ MCP 메타데이터 저장 실패:", data.message);
            }
        },

        // ✅ 실패 콜백
        onError: (error) => {
            console.error("❌ MCP 메타데이터 저장 중 오류:", error);
        },
    });
};

/* -------------------------------------------------------------------------- */
/* 🚀 MCP 배포 훅 (PATCH /mcps/dashboard/publish)                              */
/* -------------------------------------------------------------------------- */
/**
 * MCP 메타데이터를 배포하는 훅
 * - Swagger 명세: PATCH /mcps/dashboard/publish
 *
 * ✅ 사용 예시:
 * const publish = usePublishMcp();
 * await publish.mutateAsync({ file, meta });
 */
export const usePublishMcp = () => {
    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["publishMcp"],

        mutationFn: async (body) => {
            console.log("🚀 [usePublishMcp] 요청 시작:", {
                file: body.file instanceof File ? body.file.name : "empty",
                meta: body.meta,
            });

            return await mcpUploadApi.publishMcp(body);
        },

        onSuccess: (data) => {
            if (isSuccessResponse(data.code)) {
                console.log("✅ MCP 배포 완료:", data);
            } else {
                console.warn("⚠️ MCP 배포 실패:", data.message);
            }
        },

        onError: (error) => {
            console.error("❌ MCP 배포 중 오류:", error);
        },
    });
};
