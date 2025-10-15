"use client";

import { useMutation } from "@tanstack/react-query";
import { postMcpSave } from "@/services/detail/mcp-saved-api";
import type { postMcpSaveResponse } from "@/types/detail/detail-types";
import { toast } from "sonner";

/**
 * ✅ MCP 저장(구매) 훅
 * - 호출 시 POST /mcps/{mcpId}
 */
export const useMcpSave = () => {
    return useMutation<postMcpSaveResponse, Error, number>({
        mutationFn: async (mcpId: number) => {
            return await postMcpSave(mcpId);
        },
        onSuccess: (data) => {
            toast.success("✅ MCP가 성공적으로 저장되었습니다!");
            console.log("🎉 MCP 저장 성공:", data);
        },
        onError: (error: any) => {
            if (error.response?.status === 402) {
                toast.error("⚠️ 발행되지 않은 MCP입니다.");
            } else if (error.response?.status === 400) {
                toast.error("⚠️ 잘못된 요청입니다.");
            } else {
                toast.error("❌ MCP 저장에 실패했습니다.");
            }
            console.error("MCP 저장 오류:", error);
        },
    });
};
