"use client";

import { useMcpSave } from "@/hooks/detail/useMcpSave";
import { Loader2 } from "lucide-react";
import {useLoginStore} from "@/store/login/login-store";

interface SaveMcpButtonProps {
    mcpId: number;
    alreadySaved?: boolean;
}

/**
 * ✅ MCP 저장(구매) 버튼 컴포넌트
 * - 저장 안 된 경우: 클릭 시 저장 API 호출
 * - 저장된 경우: 비활성화 및 “저장 완료” 표시
 */
export default function SaveMcpButton({ mcpId, alreadySaved }: SaveMcpButtonProps) {
    const { mutate: saveMcp, isPending } = useMcpSave();
    const {isLoggedIn} = useLoginStore();

    const handleSave = () => {
        if (alreadySaved) return;
        saveMcp(mcpId);
    };

    // ✅ 로그인하지 않은 경우 — 버튼 디자인 그대로, 작동 비활성화
    if (!isLoggedIn) {
        return (
            <button
                disabled
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-gray-700 text-gray-400 cursor-not-allowed"
            >
                🔒 로그인 후 이용할 수 있습니다
            </button>
        );
    }

    return (
        <button
            onClick={handleSave}
            disabled={isPending || alreadySaved}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 
        ${
                alreadySaved
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300 active:scale-95"
            }`}
        >
            {isPending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    저장 중...
                </>
            ) : alreadySaved ? (
                "✅ 저장 완료"
            ) : (
                "💾 MCP 저장하기"
            )}
        </button>
    );
}
