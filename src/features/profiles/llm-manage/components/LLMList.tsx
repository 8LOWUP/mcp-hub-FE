"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import LLMTokenCard from "./LLMTokenCard";
import type { LLMInfo } from "@/types/chat/chat-type";

interface LLMListProps {
    llmList: LLMInfo[] | undefined;
    loadingLLMs: boolean;
    llmError: any;
    onTokenModal: (llm: LLMInfo, isEdit: boolean) => void;
    showTokenValue: { [key: string]: boolean };
    onToggleTokenVisibility: (llmId: string) => void;
}

const LLMList: React.FC<LLMListProps> = ({
    llmList,
    loadingLLMs,
    llmError,
    onTokenModal,
    showTokenValue,
    onToggleTokenVisibility
}) => {
    const t = useTranslations('ProfilePage');

    // 로딩 상태
    if (loadingLLMs) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">LLM 목록을 불러오는 중...</p>
            </div>
        );
    }

    // 에러 상태
    if (llmError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-foreground/60">LLM 목록을 불러올 수 없습니다</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {llmList?.map((llm) => (
                <LLMTokenCard 
                    key={llm.llmId}
                    llm={llm}
                    onTokenModal={onTokenModal}
                    showTokenValue={showTokenValue}
                    onToggleTokenVisibility={onToggleTokenVisibility}
                />
            ))}
        </div>
    );
};

export default LLMList;

