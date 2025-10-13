import { useMutation, useQueryClient } from "@tanstack/react-query";
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
export const useSaveMcpMeta = () => {
    const qc = useQueryClient();

    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["saveMcpMeta"],

        mutationFn: async (body) => {
            console.log("🧩 [useSaveMcpMeta] 요청 시작:", {
                file: body.file instanceof File ? body.file.name : "empty",
                meta: body.meta,
            });
            return await mcpUploadApi.saveMcpMeta(body);
        },

        onSuccess: (data, variables) => {
            if (!isSuccessResponse(data.code)) {
                console.warn("⚠️ MCP 메타데이터 저장 실패:", data.message);
                return;
            }

            const newId = data.result;
            const meta = variables.meta;

            // ✅ 1) 낙관적 업데이트: 캐시에 새 MCP 추가
            qc.setQueryData<any[]>(["myUploadedMcps"], (old) => {
                const prev = old ?? [];
                if (prev.some((x) => x.id === newId)) return prev;
                return [
                    {
                        id: newId,
                        name: meta.name ?? "(제목 없음)",
                        description: meta.description ?? "",
                        imageUrl: meta.imageUrl ?? null,
                        platformName: meta.platformName ?? "",
                        categoryName: "",
                        licenseName: "",
                        published: false,
                        lastPublishedAt: null,
                    },
                    ...prev,
                ];
            });

            // ✅ 2) 서버 데이터로 최신화
            qc.invalidateQueries({
                predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "myUploadedMcps",
            });

            console.log("✅ MCP 메타데이터 임시 저장 완료:", data);
        },

        onError: (error) => {
            console.error("❌ MCP 메타데이터 저장 중 오류:", error);
        },
    });
};

/* -------------------------------------------------------------------------- */
/* 🚀 MCP 배포 훅 (PATCH /mcps/dashboard/publish)                              */
/* -------------------------------------------------------------------------- */
export const usePublishMcp = () => {
    const qc = useQueryClient();

    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["publishMcp"],

        mutationFn: async (body) => {
            console.log("🚀 [usePublishMcp] 요청 시작:", {
                file: body.file instanceof File ? body.file.name : "empty",
                meta: body.meta,
            });
            return await mcpUploadApi.publishMcp(body);
        },

        onSuccess: (data, variables) => {
            if (!isSuccessResponse(data.code)) {
                console.warn("⚠️ MCP 배포 실패:", data.message);
                return;
            }

            const mcpId = variables.meta.mcpId ?? data.result;

            // ✅ 캐시 내 published 상태 갱신
            qc.setQueryData<any[]>(["myUploadedMcps"], (old) => {
                const prev = old ?? [];
                return prev.map((x) =>
                    x.id === mcpId ? { ...x, published: true, lastPublishedAt: new Date().toISOString() } : x
                );
            });

            // ✅ 서버 동기화
            qc.invalidateQueries({
                predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "myUploadedMcps",
            });

            console.log("✅ MCP 배포 완료:", data);
        },

        onError: (error) => {
            console.error("❌ MCP 배포 중 오류:", error);
        },
    });
};
