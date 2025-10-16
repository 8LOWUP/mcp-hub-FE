// src/features/profiles/hooks/useWorkspaceMcpToken.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getWorkspaceMcpToken,
    saveWorkspaceMcpToken,
    McpTokenGetResult,
} from "@/services/workspaces/mcps/token";

const qk = (platformId?: string) => ["workspace", "mcpToken", String(platformId ?? "")];

export const useWorkspaceMcpToken = (platformId?: string) => {
    const qc = useQueryClient();

    const tokenQuery = useQuery({
        queryKey: qk(platformId),
        queryFn: () => {
            if (!platformId) {
                console.warn("⚠️ platformId 없음 → 빈 데이터 반환");
                return Promise.resolve({ platformId: "", token: "" } as McpTokenGetResult);
            }
            return getWorkspaceMcpToken(platformId);
        },
        enabled: !!platformId,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
    });

    /* =========================
     * 저장: 낙관적 업데이트
     * ========================= */
    const saveMutation = useMutation({
        mutationFn: async (token: string) => {
            if (!platformId) throw new Error("platformId is required");
            return saveWorkspaceMcpToken(platformId, token);
        },
        // 🔸 서버 응답 전에 캐시를 먼저 바꿔서 모달 즉시 반영
        onMutate: async (submittedToken) => {
            if (!platformId) return;
            const key = qk(platformId);

            // 1) 해당 쿼리 중단(경합 방지)
            await qc.cancelQueries({ queryKey: key });

            // 2) 이전 스냅샷 저장(롤백용)
            const previous = qc.getQueryData<McpTokenGetResult>(key);

            // 3) 낙관적 캐시 반영
            qc.setQueryData<McpTokenGetResult>(key, {
                platformId: String(platformId),
                token: submittedToken, // 입력한 값을 즉시 보여줌
            });

            return { key, previous };
        },
        // 실패 시 롤백
        onError: (err, _submittedToken, ctx) => {
            if (ctx?.previous) qc.setQueryData(ctx.key, ctx.previous);
            console.error("❌ 토큰 저장 실패:", err);
        },
        // 성공/실패 상관없이 서버와 동기화(마스킹 정책 등 반영)
        onSettled: () => {
            if (!platformId) return;
            qc.invalidateQueries({ queryKey: qk(platformId) });
        },
    });

    /* =========================
     * 삭제: 낙관적 업데이트
     * ========================= */
    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!platformId) throw new Error("platformId is required");
            // 서버가 같은 엔드포인트로 빈 문자열 저장시 삭제 취급한다고 가정
            return saveWorkspaceMcpToken(platformId, "");
        },
        onMutate: async () => {
            if (!platformId) return;
            const key = qk(platformId);
            await qc.cancelQueries({ queryKey: key });
            const previous = qc.getQueryData<McpTokenGetResult>(key);

            qc.setQueryData<McpTokenGetResult>(key, {
                platformId: String(platformId),
                token: "",
            });

            return { key, previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) qc.setQueryData(ctx.key, ctx.previous);
            console.error("❌ 토큰 삭제 실패:", err);
        },
        onSettled: () => {
            if (!platformId) return;
            qc.invalidateQueries({ queryKey: qk(platformId) });
        },
    });

    return {
        tokenQuery,
        saveToken: saveMutation.mutateAsync,
        deleteToken: deleteMutation.mutateAsync,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
