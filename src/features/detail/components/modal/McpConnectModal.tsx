// src/features/detail/components/modal/McpConnectModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Eye, EyeOff, X } from "lucide-react";
import { useWorkspaceMcpToken } from "@/features/profiles/hooks/useWorkspaceMcpToken";

type Step = 1 | 2 | 3;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConnected: () => void;
    mcpName: string;
    platformId: string; // ✅ 플랫폼 단위 토큰 관리
}

/**
 * ✅ MCP 토큰 등록/교체 모달 (상세 화면)
 * - 모달이 열릴 때 같은 훅의 쿼리키로 refetch → 현재 저장된 키를 인풋에 프리필
 * - 저장 성공 시 동일 쿼리키 invalidate → profiles/상세 모두 동기화
 * - 보기/가리기 토글 지원
 */
const McpConnectModal: React.FC<Props> = ({
                                              isOpen,
                                              onClose,
                                              onConnected,
                                              mcpName,
                                              platformId,
                                          }) => {
    const [step, setStep] = React.useState<Step>(1);
    const [apiKey, setApiKey] = React.useState("");
    const [revealed, setRevealed] = React.useState(false);

    // 프리필 제어 + 안전 동기화
    const hasPrefilledRef = React.useRef(false);
    const prevFromQueryRef = React.useRef<string | undefined>(undefined);

    const { tokenQuery, saveToken, isSaving } = useWorkspaceMcpToken(platformId);

    /** 모달 열릴 때 최신 토큰을 가져온다 */
    React.useEffect(() => {
        if (!isOpen || !platformId) return;

        // 상태 초기화
        hasPrefilledRef.current = false;
        prevFromQueryRef.current = undefined;

        setStep(1);
        setRevealed(false);

        // 항상 최신 상태로
        tokenQuery.refetch().catch(() => void 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, platformId]);

    /** 쿼리 결과가 바뀌면 인풋에 안전 동기화 (사용자 입력을 덮어쓰지 않음) */
    React.useEffect(() => {
        if (!isOpen) return;
        const token = tokenQuery.data?.token ?? "";

        if (!hasPrefilledRef.current || apiKey === prevFromQueryRef.current) {
            setApiKey(token);                  // ✅ 안전 동기화
            hasPrefilledRef.current = true;
        }

        prevFromQueryRef.current = token;
        // apiKey는 의존성에 넣지 말 것
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, tokenQuery.data?.token]);

    const reset = () => {
        setStep(1);
        setApiKey("");
        setRevealed(false);
        hasPrefilledRef.current = false;
        prevFromQueryRef.current = undefined;
    };

    const handleNext = async () => {
        if (step === 1) {
            const trimmed = apiKey.trim();
            if (!trimmed) {
                alert("API Key를 입력해주세요.");
                return;
            }
            setStep(2);
            try {
                await saveToken(trimmed);   // 훅 onMutate에서 캐시 즉시 갱신
                setApiKey(trimmed);         // ✅ 입력창도 즉시 업데이트
                hasPrefilledRef.current = true;
                setStep(3);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("MCP 토큰 등록 실패:", error);
                alert("❌ MCP 토큰 등록 실패. 다시 시도해주세요.");
                setStep(1);
            }
        } else if (step === 3) {
            onConnected?.();
            onClose();
            reset();
        }
    };

    const handleBack = () => {
        if (step > 1 && step < 3) setStep((prev) => (prev - 1) as Step);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                reset();
            }}
            size="md"
            title={
                <div className="flex w-full items-center justify-between">
                    <span>MCP 연결</span>
                    {(step === 1 || step === 3) && (
                        <button
                            onClick={() => {
                                onClose();
                                reset();
                            }}
                            className="transition text-gray-400 hover:text-white"
                            aria-label="모달 닫기"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            }
            footer={
                <div className="flex justify-end gap-2">
                    {step > 1 && step < 3 && (
                        <PrimaryButton onClick={handleBack} additionalClassName="bg-gray-600">
                            이전
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        onClick={handleNext}
                        disabled={isSaving || (step === 1 && !apiKey.trim())}
                    >
                        {step === 1
                            ? "등록"
                            : step === 2
                                ? isSaving
                                    ? "등록 중..."
                                    : "완료"
                                : "닫기"}
                    </PrimaryButton>
                </div>
            }
        >
            {step === 1 && (
                <div className="space-y-2">
                    <p className="mb-2 font-semibold">
                        MCP <b>{mcpName}</b> API Key {tokenQuery.isFetching ? "불러오는 중..." : "등록 / 교체"}
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type={revealed ? "text" : "password"}
                            placeholder="API Key를 입력하세요"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full rounded-md border border-gray-500 bg-black px-3 py-2 text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setRevealed((v) => !v)}
                            className="rounded-md border border-gray-600 p-2 text-gray-200 hover:bg-gray-800"
                            title={revealed ? "가리기" : "보기"}
                        >
                            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {/* 상태 텍스트 (선택) */}
                    <p className="text-xs text-gray-400">
                        {tokenQuery.isFetching
                            ? "현재 등록된 키를 불러오는 중입니다…"
                            : tokenQuery.data?.token
                                ? "현재 저장된 키가 프리필되었습니다. 수정 후 등록하면 교체됩니다."
                                : "저장된 키가 없습니다. 새 키를 등록하세요."}
                    </p>
                </div>
            )}

            {step === 2 && <div className="text-center text-gray-300">MCP 토큰을 등록 중입니다...</div>}

            {step === 3 && (
                <div className="text-center">
                    <p className="font-semibold">✅ MCP 토큰 등록 완료!</p>
                </div>
            )}
        </BaseModal>
    );
};

export default McpConnectModal;
