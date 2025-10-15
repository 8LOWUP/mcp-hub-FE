"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { CheckCircle, X } from "lucide-react";
import { useUpdateMcpToken } from "@/hooks/detail/useMcpToken"; // ✅ 추가

type Step = 1 | 2 | 3;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConnected: () => void;
    mcpName: string; // ✅ 현재 선택된 MCP 이름
    platformId: string; // ✅ 실제 등록용 플랫폼 ID
}

const McpConnectModal: React.FC<Props> = ({
                                              isOpen,
                                              onClose,
                                              onConnected,
                                              mcpName,
                                              platformId,
                                          }) => {
    const [step, setStep] = useState<Step>(1);
    const [apiKey, setApiKey] = useState("");

    // ✅ React Query mutation 훅
    const { mutateAsync: updateToken, isPending } = useUpdateMcpToken();

    const handleNext = async () => {
        // Step 1 → 2
        if (step === 1) {
            if (!apiKey) return alert("API Key를 입력해주세요.");
            setStep(2);
            return;
        }

        // Step 2 → 서버에 실제 전송
        if (step === 2) {
            try {
                await updateToken({
                    platformId,
                    body: { token: apiKey },
                });

                setStep(3); // ✅ 성공 시 완료 단계로 이동
            } catch (error: any) {
                console.error("Token 등록 실패:", error);
                alert("❌ MCP 토큰 등록 실패. 다시 시도해주세요.");
            }
            return;
        }

        // Step 3 → 닫기 및 콜백 실행
        if (step === 3) {
            onConnected();
            onClose();
        }
    };

    const handleBack = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-4">
                        <p className="text-lg font-semibold">API Key 등록</p>
                        <input
                            type="text"
                            placeholder="Enter your API key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="border border-gray-600 focus:border-accent rounded-md px-3 py-2 bg-black text-white outline-none focus:ring-0"
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center gap-6">
                        <p className="text-lg font-semibold">계정 연결 중...</p>
                        <div className="flex gap-8">
                            {/* ✅ 왼쪽: 현재 MCP 이름 */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-yellow-400 font-semibold text-center px-2">
                                    {mcpName?.length > 8 ? `${mcpName.slice(0, 8)}…` : mcpName}
                                </div>
                                <span className="text-sm text-gray-300 mt-2">MCP</span>
                            </div>

                            {/* ✅ 오른쪽: MCP Hub 로고 */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center">
                                    <span className="text-yellow-300 font-bold text-lg">Hub</span>
                                </div>
                                <span className="text-sm text-gray-300 mt-2">MCP Hub</span>
                            </div>
                        </div>

                        {isPending && (
                            <p className="text-sm text-gray-400 mt-4 animate-pulse">
                                🔄 MCP 토큰을 등록 중입니다...
                            </p>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col items-center justify-center py-10">
                        <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                        <p className="text-lg font-semibold">연결이 완료되었습니다!</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="lg"
            footer={
                <div className="flex justify-end gap-3">
                    {step > 1 && step < 3 && (
                        <PrimaryButton onClick={handleBack} additionalClassName="bg-gray-700">
                            이전
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        onClick={handleNext}
                        disabled={isPending || (step === 1 && !apiKey)}
                        additionalClassName={
                            step === 3
                                ? "bg-green-500 text-black hover:bg-green-400"
                                : "bg-accent text-black hover:bg-accent-hover"
                        }
                    >
                        {step === 1
                            ? "다음"
                            : step === 2
                                ? isPending
                                    ? "등록 중..."
                                    : "등록"
                                : "완료"}
                    </PrimaryButton>
                </div>
            }
        >
            {/* ✅ 상단 닫기 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">MCP 연결</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="닫기"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="text-secondary">{renderStep()}</div>
        </BaseModal>
    );
};

export default McpConnectModal;
