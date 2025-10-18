"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import BaseModal from "@/components/ui/modal/BaseModal";
import type { LLMInfo } from "@/types/chat/chat-type";

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    llm: LLMInfo | null;
    tokenInput: string;
    setTokenInput: (value: string) => void;
    isLoading: boolean;
    validationState: 'valid' | 'invalid' | 'validating' | null;
}

const TokenModal: React.FC<TokenModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    llm, 
    tokenInput, 
    setTokenInput, 
    isLoading,
    validationState
}) => {
    const t = useTranslations('ProfilePage');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    if (!llm) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={tokenInput ? t('editToken') : t('addToken')}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        LLM 모델
                    </label>
                    <div className="w-full px-3 py-2 border border-border rounded-lg bg-surface-2 text-foreground">
                        {llm.modelName} ({llm.llmProvider})
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        토큰
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground font-mono pr-10 ${
                                validationState === 'invalid' 
                                    ? 'border-red-500 focus:border-red-500' 
                                    : validationState === 'valid'
                                    ? 'border-green-500 focus:border-green-500'
                                    : 'border-border focus:border-primary'
                            }`}
                            placeholder="sk-..."
                            required
                        />
                        {validationState === 'validating' && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        )}
                        {validationState === 'valid' && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            </div>
                        )}
                        {validationState === 'invalid' && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                                    <span className="text-white text-xs">✗</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {validationState === 'invalid' && (
                        <p className="text-red-500 text-sm mt-1">
                            토큰이 유효하지 않습니다. 올바른 토큰을 입력해주세요.
                        </p>
                    )}
                    {validationState === 'valid' && (
                        <p className="text-green-500 text-sm mt-1">
                            토큰이 유효합니다.
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <PrimaryButton type="button" onClick={onClose}>
                        취소
                    </PrimaryButton>
                    <PrimaryButton 
                        type="submit" 
                        disabled={isLoading || !tokenInput.trim() || validationState === 'invalid'}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                처리 중...
                            </>
                        ) : (
                            '저장'
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </BaseModal>
    );
};

export default TokenModal;
