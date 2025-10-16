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

    console.log(
        "%c[useWorkspaceMcpToken]",
        "color:#4fc3f7;font-weight:bold;",
        "platformId=",
        platformId,
        "queryKey=",
        qk(platformId)
    );

    const tokenQuery = useQuery({
        queryKey: qk(platformId),
        queryFn: () => {
            if (!platformId) {
                console.warn("⚠️ platformId 없음 → 빈 데이터 반환");
                return Promise.resolve({ platformId: "", token: "" } as McpTokenGetResult);
            }
            console.log("🔍 GET 토큰 요청:", platformId);
            return getWorkspaceMcpToken(platformId);
        },
        enabled: !!platformId,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
    });

    /* ---------------------------
     * ✅ 저장 (전역 캐시 즉시 갱신)
     * --------------------------- */
    const saveMutation = useMutation({
        mutationFn: (token: string) => {
            if (!platformId) {
                console.error("❌ saveToken 호출 시 platformId 없음");
                return Promise.reject(new Error("platformId is required"));
            }
            console.log("💾 POST 토큰 저장 요청:", { platformId, token });
            return saveWorkspaceMcpToken(platformId, token);
        },
        onSuccess: (_res, submittedToken) => {
            if (!platformId) return;
            const key = qk(platformId);
            console.log("✅ 저장 성공! 즉시 캐시 반영:", submittedToken);

            // ✅ 전역 캐시 갱신 → 모든 useWorkspaceMcpToken 구독자가 즉시 최신값으로 동기화됨
            qc.setQueryData<McpTokenGetResult>(key, {
                platformId: String(platformId),
                token: submittedToken,
            });

            // ✅ 백그라운드 동기화 (서버의 마스킹 정책 반영용)
            qc.invalidateQueries({ queryKey: key });
        },
        onError: (err) => {
            console.error("❌ 토큰 저장 실패:", err);
        },
    });

    /* ---------------------------
     * ✅ 삭제 (전역 캐시 즉시 비우기)
     * --------------------------- */
    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!platformId) {
                console.error("❌ deleteToken 호출 시 platformId 없음");
                return Promise.reject(new Error("platformId is required"));
            }
            console.log("🗑️ 토큰 삭제 요청:", platformId);
            return saveWorkspaceMcpToken(platformId, "");
        },
        onSuccess: () => {
            if (!platformId) return;
            const key = qk(platformId);
            console.log("✅ 토큰 삭제 완료, 캐시 즉시 초기화");

            // ✅ 전역 캐시 즉시 초기화
            qc.setQueryData<McpTokenGetResult>(key, {
                platformId: String(platformId),
                token: "",
            });

            // ✅ 백그라운드 동기화
            qc.invalidateQueries({ queryKey: key });
        },
        onError: (err) => {
            console.error("❌ 토큰 삭제 실패:", err);
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
