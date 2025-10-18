"use client";

import React, { useState } from "react";
import { useLLMs, useSetLLMToken, useUpdateLLMToken } from "@/hooks/chat/useLLM";
import type { LLMInfo } from "@/types/chat/chat-type";
import { toast } from "sonner";
import LLMHeader from "./components/LLMHeader";
import LLMList from "./components/LLMList";
import TokenModal from "./components/TokenModal";

const LLMManagePage: React.FC = () => {
    // API 훅들
    const { data: llmList, isLoading: loadingLLMs, error: llmError } = useLLMs();
    
    // 뮤테이션 훅들
    const setTokenMutation = useSetLLMToken();
    const updateTokenMutation = useUpdateLLMToken();
    
    // UI 상태
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [editingLLM, setEditingLLM] = useState<LLMInfo | null>(null);
    const [showTokenValue, setShowTokenValue] = useState<{ [key: string]: boolean }>({});
    const [tokenInput, setTokenInput] = useState("");
    const [tokenValidation, setTokenValidation] = useState<{ [key: string]: 'valid' | 'invalid' | 'validating' | null }>({});
    const [llmTokenStates, setLlmTokenStates] = useState<{ [llmId: string]: { hasToken: boolean; token?: string; loading: boolean } }>({});

    // 토큰 추가/편집 모달 열기
    const handleTokenModal = (llm: LLMInfo, isEdit: boolean = false) => {
        setEditingLLM(llm);
        setTokenInput("");
        setShowTokenModal(true);
    };

    // 토큰 저장/수정 (검증 포함)
    const handleSaveToken = async () => {
        if (!editingLLM || !tokenInput.trim()) return;

        setTokenValidation(prev => ({ ...prev, [editingLLM.llmId]: 'validating' }));

        try {
            // 토큰이 존재하는지 확인하여 POST/PATCH 결정
            const hasExistingToken = llmTokenStates[editingLLM.llmId]?.hasToken || false;
            
            if (hasExistingToken) {
                // 기존 토큰이 있으면 수정
                await updateTokenMutation.mutateAsync({
                    llmId: editingLLM.llmId,
                    llmToken: tokenInput
                });
            } else {
                // 기존 토큰이 없으면 새로 생성
                await setTokenMutation.mutateAsync({
                    llmId: editingLLM.llmId,
                    llmToken: tokenInput
                });
            }
            
            setTokenValidation(prev => ({ ...prev, [editingLLM.llmId]: 'valid' }));
            toast.success("✅ 토큰이 성공적으로 저장되었습니다!");
            
            setShowTokenModal(false);
            setEditingLLM(null);
            setTokenInput("");
            setTokenValidation({});
        } catch (error: any) {
            // 에러 메시지 분석
            const errorMessage = error?.response?.data?.message || 
                                error?.response?.data?.error || 
                                error?.message || 
                                "토큰 저장에 실패했습니다.";
            
            // 오류 토스트 표시
            toast.error(`❌ ${errorMessage}`);
            
            // 실패 상태 표시 (시각적 피드백)
            setTokenValidation(prev => ({ ...prev, [editingLLM.llmId]: 'invalid' }));
            
            // 2초 후 유효성 상태 초기화 (재시도 가능하도록)
            setTimeout(() => {
                setTokenValidation(prev => ({ ...prev, [editingLLM.llmId]: null }));
            }, 2000);
        }
    };

    // 토큰 표시/숨김 토글
    const handleToggleTokenVisibility = (llmId: string) => {
        setShowTokenValue(prev => ({
            ...prev,
            [llmId]: !prev[llmId]
        }));
    };


    return (
        <div className="space-y-6 p-6">
            <LLMHeader />
            
            <LLMList
                llmList={llmList}
                loadingLLMs={loadingLLMs}
                llmError={llmError}
                onTokenModal={handleTokenModal}
                showTokenValue={showTokenValue}
                onToggleTokenVisibility={handleToggleTokenVisibility}
            />

            <TokenModal
                isOpen={showTokenModal}
                onClose={() => {
                    setShowTokenModal(false);
                    setEditingLLM(null);
                    setTokenInput("");
                    setTokenValidation({});
                }}
                onSave={handleSaveToken}
                llm={editingLLM}
                tokenInput={tokenInput}
                setTokenInput={(value) => {
                    setTokenInput(value);
                    // 토큰 입력이 변경되면 유효성 상태 초기화 (재시도 가능하도록)
                    if (editingLLM) {
                        setTokenValidation(prev => ({ ...prev, [editingLLM.llmId]: null }));
                    }
                }}
                isLoading={setTokenMutation.isPending || updateTokenMutation.isPending}
                validationState={editingLLM ? tokenValidation[editingLLM.llmId] : null}
            />
        </div>
    );
};

export default LLMManagePage;