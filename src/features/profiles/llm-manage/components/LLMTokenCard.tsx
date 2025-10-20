"use client";

import React from "react";
import { Edit, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLLMTokens } from "@/hooks/chat/useLLM";
import type { LLMInfo } from "@/types/chat/chat-type";

interface LLMTokenCardProps {
    llm: LLMInfo;
    onTokenModal: (llm: LLMInfo, isEdit: boolean) => void;
    showTokenValue: { [key: string]: boolean };
    onToggleTokenVisibility: (llmId: string) => void;
}

const LLMTokenCard: React.FC<LLMTokenCardProps> = ({ 
    llm, 
    onTokenModal, 
    showTokenValue, 
    onToggleTokenVisibility 
}) => {
    const t = useTranslations('ProfilePage');
    
    // 각 LLM별로 토큰 상태 조회 (GET /workspaces/llm/token/{llmId})
    const { data: tokenData, isLoading: loadingToken, error: tokenError } = useLLMTokens(llm.llmId);
    
    // GET API 응답 데이터 구조: { llmId: string, exists: boolean, llmToken: string }
    const hasToken = tokenData && tokenData.exists === true;
    const currentToken = hasToken ? tokenData.llmToken : null;
    const tokenInfo = hasToken ? tokenData : null;
    
    return (
        <div className="flex flex-col max-w-5xl bg-surface-1 rounded-lg p-6 border border-border">
            <div className="flex-1">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-foreground">
                                {llm.modelName}
                            </h3>
                            {loadingToken ? (
                                <span className="px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                                    {t('checkingApi')}
                                </span>
                            ) : tokenError ? (
                                <span className="px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    ❌ {t('checkFailed')}
                                </span>
                            ) : (
                                <span className={`px-3 py-2 rounded-full text-sm font-medium ${
                                    hasToken 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {hasToken ? `${t('tokenSet')}` : `${t('noToken')}`}
                                </span>
                            )}
                        </div>

                        {/* 데스크톱 버튼 - 550px 이상에서만 표시 */}
                        <div className="hidden min-[830px]:flex items-center gap-2 ml-4 self-start">
                            <PrimaryButton
                                onClick={() => onTokenModal(llm, hasToken || false)}
                                disabled={loadingToken}
                            >
                                <Edit className="h-4 w-4" />
                                {loadingToken ? t('checkingApi') : tokenError ? t('retry') : hasToken ? t('editToken') : t('addToken')}
                            </PrimaryButton>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div>
                            <span className="font-medium text-base">{t('provider')}:</span> <span className="text-base">{llm.llmProvider}</span>
                        </div>
                        <div>
                            <span className="font-medium text-base">{t('modelId')}:</span> 
                            <code className="ml-1 px-2 py-1 bg-surface-2 rounded text-md">{llm.llmId}</code>
                        </div>
                    </div>

                    {hasToken && currentToken && (
                        <div className="flex items-center w-full mt-4 gap-3">
                            <div 
                                className="font-mono text-base bg-surface-2 px-3 py-2 rounded min-w-[100px] h-fit flex-1 cursor-pointer hover:bg-surface-3 transition-colors whitespace-pre-wrap break-all"
                                title={showTokenValue[llm.llmId] ? currentToken : '토큰을 보려면 눈 아이콘을 클릭하세요'}
                            >
                                {showTokenValue[llm.llmId] ? currentToken : '*'.repeat(currentToken?.length)}
                            </div>
                            <button
                                onClick={() => onToggleTokenVisibility(llm.llmId)}
                                className="p-1 hover:bg-surface-2 rounded"
                            >
                                {showTokenValue[llm.llmId] ? (
                                    <EyeOff className="h-8 w-8" />
                                ) : (
                                    <Eye className="h-8 w-8" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* 모바일 버튼 영역 - 550px 이하에서만 표시 */}
            <div className="min-[830px]:hidden mt-4 pt-4 border-t border-border/50">
                <div className="flex justify-start">
                    <PrimaryButton
                        onClick={() => onTokenModal(llm, hasToken || false)}
                        disabled={loadingToken}
                    >
                        <Edit className="h-4 w-4" />
                        {loadingToken ? t('checkingApi') : tokenError ? t('retry') : hasToken ? t('editToken') : t('addToken')}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default LLMTokenCard;
