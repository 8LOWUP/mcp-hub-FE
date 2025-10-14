"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { usePostMcpToken } from "@/hooks/detail/useMcpToken"; // ✅ MCP 토큰 등록 훅

type Step = 1 | 2 | 3;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConnected: () => void;
    mcpName: string;
    platformId: string;
}

/**
 * ✅ MCP 토큰 등록 모달
 * - Step 1: API 키 입력
 * - Step 2: 등록 요청 중
 * - Step 3: 등록 완료
 */
const McpConnectModal: React.FC<Props> = ({
                                              isOpen,
                                              onClose,
                                              onConnected,
                                              mcpName,
                                              platformId,
                                          }) => {
    const [step, setStep] = useState<Step>(1);
    const [apiKey, setApiKey] = useState("");

    const { mutateAsync: postToken, isPending } = usePostMcpToken();

    const handleNext = async () => {
        if (step === 1) {
            if (!apiKey.trim()) {
                alert("API Key를 입력해주세요.");
                return;
            }
            setStep(2);
            try {
                await postToken({
                    platformId,
                    body: { token: apiKey },
                });
                setStep(3);
            } catch (error) {
                console.error("MCP 토큰 등록 실패:", error);
                alert("❌ MCP 토큰 등록 실패. 다시 시도해주세요.");
                setStep(1);
            }
        } else if (step === 3) {
            onConnected();
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep((prev) => ((prev - 1) as Step));
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="MCP 연결"
            size="md"
            footer={
                <div className="flex justify-end gap-2">
                    {step > 1 && step < 3 && (
                        <PrimaryButton onClick={handleBack} additionalClassName="bg-gray-600">
                            이전
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        onClick={handleNext}
                        disabled={isPending || (step === 1 && !apiKey)}
                    >
                        {step === 1
                            ? "등록"
                            : step === 2
                                ? isPending
                                    ? "등록 중..."
                                    : "완료"
                                : "닫기"}
                    </PrimaryButton>
                </div>
            }
        >
            {step === 1 && (
                <div>
                    <p className="mb-2 font-semibold">MCP <b>{mcpName}</b> API Key 등록</p>
                    <input
                        type="text"
                        placeholder="API Key를 입력하세요"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="border border-gray-500 w-full rounded-md px-3 py-2 bg-black text-white"
                    />
                </div>
            )}

            {step === 2 && (
                <div className="text-center text-gray-300">
                    MCP 토큰을 등록 중입니다...
                </div>
            )}

            {step === 3 && (
                <div className="text-center">
                    <p className="font-semibold">✅ MCP 토큰 등록 완료!</p>
                </div>
            )}
        </BaseModal>
    );
};

export default McpConnectModal;
