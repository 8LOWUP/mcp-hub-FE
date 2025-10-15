// src/features/profiles/hooks/useWorkspaceMcpToken.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getWorkspaceMcpToken,
    saveWorkspaceMcpToken,
    McpTokenGetResult,
} from "@/services/workspaces/mcps/token";

const qk = (platformId?: string) => ["workspace", "mcpToken", platformId];

export const useWorkspaceMcpToken = (platformId?: string) => {
    const qc = useQueryClient();

    const tokenQuery = useQuery({
        queryKey: qk(platformId),
        queryFn: () => {
            if (!platformId) {
                return Promise.resolve({ platformId: "", token: "" } as McpTokenGetResult);
            }
            return getWorkspaceMcpToken(platformId);
        },
        enabled: !!platformId,
        staleTime: 0,
    });

    const saveMutation = useMutation({
        mutationFn: (token: string) => {
            if (!platformId) return Promise.reject(new Error("platformId is required"));
            return saveWorkspaceMcpToken(platformId, { token });
        },
        onSuccess: () => {
            if (platformId) qc.invalidateQueries({ queryKey: qk(platformId) });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!platformId) return Promise.reject(new Error("platformId is required"));
            // 삭제 API 없음 → 빈 문자열 저장으로 대체
            return saveWorkspaceMcpToken(platformId, { token: "" });
        },
        onSuccess: () => {
            if (platformId) qc.invalidateQueries({ queryKey: qk(platformId) });
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
