// src/hooks/upload/useMcpUpload.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mcpUploadApi } from "@/services/upload/McpUpload-api";
import type {
    McpMetaRequestFormData,
    McpMetaResponse,
} from "@/types/upload/upload-types";
import { UPLOADED_MCPS_QK } from "@/features/profiles/deployed/hooks/useMyUploadedMcps";
// import { UPLOAD_DRAFT_QK } from "@/hooks/upload/useUploadDraftList"; // ⬅️ 임시저장 전용 키가 있다면 함께 invalidate

/* -------------------------------------------------------------------------- */
/* 🧠 공통: 성공 코드 판정 유틸 함수                                           */
/* -------------------------------------------------------------------------- */
const isSuccessResponse = (code?: string) =>
    code === "SUCCESS" || code === "COMMON200" || code === "200";

/* 간단 딜레이 유틸 (서버 반영 지연 대비 폴링에 사용) */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

            // ✅ 1) 낙관적 업데이트: 현재 열려 있는 모든 페이지 캐시에 prepend
            qc.setQueriesData(
                {
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                },
                (old: any) => {
                    if (!old || !Array.isArray(old?.content)) return old;
                    if (old.content.some((x: any) => String(x.id) === String(newId))) {
                        return old;
                    }
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
                            // 리스트에서는 published가 없을 수 있음 → 배포 전이므로 명확히 비움
                            published: false,
                            publishedDate: null,
                            lastPublishedAt: null,
                        },
                        ...old.content,
                    ];
                    return next;
                }
            );

            // ✅ 2) 서버 데이터로 전체 동기화 (페이지네이션/검색 포함)
            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
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
            // 스웨거 스펙: multipart/form-data + meta(JSON)
            return await mcpUploadApi.publishMcp(body);
        },

        onSuccess: async (data, variables) => {
            if (!isSuccessResponse(data.code)) {
                console.warn("⚠️ MCP 배포 실패:", data.message);
                return;
            }

            const rawId = variables.meta.mcpId ?? data.result;
            const mcpIdStr = String(rawId);
            const nowIso = new Date().toISOString();

            // ✅ 1) 프리픽스 전체에서 낙관적 갱신: 배포 판정 키(publishedDate/lastPublishedAt) 채움
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
                        published: true,        // 상세 응답에 있을 수 있는 플래그
                        publishedDate: nowIso,  // ✅ 리스트 판정에 직접 쓰이는 필드
                        lastPublishedAt: nowIso,
                    };
                    return next;
                }
            );

            // ✅ 2) 서버 동기화 (정렬: publishedDate,desc / 페이지 이동 반영)
            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
            });

            // ⏳ 3) 짧은 폴링: 서버가 publishedDate를 채울 때까지 2~3회 재확인 (지연 대응)
            for (let i = 0; i < 3; i++) {
                await delay(400); // 0.4s 대기
                await qc.invalidateQueries({
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                });

                const caches = qc.getQueriesData<any>({
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === UPLOADED_MCPS_QK[0],
                });

                const reflected = caches.some(([, page]) => {
                    if (!page || !Array.isArray(page?.content)) return false;
                    const item = page.content.find((x: any) => String(x.id) === mcpIdStr);
                    return item && (item.publishedDate || item.lastPublishedAt || item.published === true);
                });

                if (reflected) break; // 서버 반영 확인되면 종료
            }

            // ✅ (선택) 임시저장 전용 리스트 키가 있다면 함께 무효화
            // qc.invalidateQueries({ queryKey: UPLOAD_DRAFT_QK, exact: false });

            console.log("✅ MCP 배포 완료:", data);
        },

        onError: (error) => {
            console.error("❌ MCP 배포 중 오류:", error);
        },
    });
};
