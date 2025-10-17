//src/hooks/upload/useMcpUpload.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type { McpMetaRequestFormData, McpMetaResponse } from "@/types/upload/upload-types";
import { UPLOADED_MCPS_QK } from "@/features/profiles/deployed/hooks/useMyUploadedMcps";

/* -------------------------------------------------------------------------- */
/* 공통 유틸                                                                   */
/* -------------------------------------------------------------------------- */
const isSuccessResponse = (code?: string) =>
    code === "SUCCESS" || code === "COMMON200" || code === "200";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------- */
/* MCP 메타데이터 임시 저장                                                    */
/* -------------------------------------------------------------------------- */
export const useSaveMcpMeta = () => {
    const qc = useQueryClient();

    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["saveMcpMeta"],
        mutationFn: (body) => mcpUploadApi.saveMcpMeta(body),
        onSuccess: (data, variables) => {
            if (!isSuccessResponse(data.code)) return;

            const newId = data.result;
            const meta = variables.meta;

            // 낙관적 prepend
            qc.setQueriesData(
                {
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                },
                (old: any) => {
                    if (!old || !Array.isArray(old?.content)) return old;
                    if (old.content.some((x: any) => String(x.id) === String(newId))) return old;

                    const next = { ...old };
                    next.content = [
                        {
                            id: newId,
                            name: meta.name ?? "(제목 없음)",
                            description: meta.description ?? "",
                            imageUrl: meta.imageUrl ?? null,
                            platformName: meta.platformName ?? "",
                            categoryName: "",
                            licenseName: "",
                            published: false,
                            publishedDate: null,
                            lastPublishedAt: null,
                        },
                        ...old.content,
                    ];
                    return next;
                }
            );

            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
            });
        },
        onError: (e) => {
            // eslint-disable-next-line no-console
            console.error("❌ MCP 메타데이터 저장 중 오류:", e);
        },
    });
};

/* -------------------------------------------------------------------------- */
/* MCP 배포 (dashboard/publish)                                                */
/* -------------------------------------------------------------------------- */
export const usePublishMcp = () => {
    const qc = useQueryClient();

    return useMutation<McpMetaResponse, Error, McpMetaRequestFormData>({
        mutationKey: ["publishMcp"],
        mutationFn: (body) => mcpUploadApi.publishMcp(body),
        onSuccess: async (data, variables) => {
            if (!isSuccessResponse(data.code)) return;

            const mcpIdStr = String(variables.meta.mcpId);
            const nowIso = new Date().toISOString();

            // 낙관적 반영
            qc.setQueriesData(
                {
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                },
                (old: any) => {
                    if (!old || !Array.isArray(old?.content)) return old;
                    const idx = old.content.findIndex((x: any) => String(x.id) === mcpIdStr);
                    if (idx < 0) return old;

                    const next = { ...old };
                    next.content = [...old.content];
                    next.content[idx] = {
                        ...old.content[idx],
                        published: true,
                        publishedDate: nowIso,
                        lastPublishedAt: nowIso,
                    };
                    return next;
                }
            );

            // 서버 동기화 + 짧은 폴링
            for (let i = 0; i < 3; i++) {
                await delay(300);
                await qc.invalidateQueries({
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                });
            }
        },
        onError: (e) => {
            // eslint-disable-next-line no-console
            console.error("❌ MCP 배포 중 오류:", e);
        },
    });
};
