// src/features/profiles/components/modals/DeleteMcpFlowModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Step = "confirm" | "done";

type DeleteMcpFlowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    /** 실제 삭제 API 호출. 성공 시 resolve, 실패 시 throw */
    onConfirm: () => Promise<void> | void;
    title?: string; // 기본값: "Delete MCP"
};

const DeleteMcpFlowModal: React.FC<DeleteMcpFlowModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onConfirm,
                                                                   title = "Delete MCP",
                                                               }) => {
    const [step, setStep] = React.useState<Step>("confirm");
    const [isLoading, setIsLoading] = React.useState(false);
    const isConfirm = step === "confirm";

    // 모달 열릴 때 상태 초기화
    React.useEffect(() => {
        if (isOpen) {
            setStep("confirm");
            setIsLoading(false);
            // 디버깅용
            // eslint-disable-next-line no-console
            console.log("[MODAL] mounted (isOpen=true)");
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            // eslint-disable-next-line no-console
            console.log("[MODAL] confirm clicked");
            await onConfirm();
            setStep("done");
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("[MODAL] confirm error", e);
        } finally {
            setIsLoading(false);
        }
    };

    // 진행 중에는 밖을 눌러도 닫히지 않게 막기 (BaseModal이 지원한다면)
    const handleRequestClose = () => {
        if (isLoading) return; // 진행 중 닫기 방지
        onClose();
    };

    // ✅ isOpen일 때만 마운트 (렌더) — 포털/포커스/전파 이슈 최소화
    return isOpen ? (
        <BaseModal
            isOpen={true}
            onClose={handleRequestClose}
            title={title}
            size="md"
        >
            <div className="flex flex-col gap-6">
                {isConfirm ? (
                    <>
                        {/* 질문 박스 */}
                        <div className="rounded-[20px] bg-surface-2 px-6 py-4 text-center">
                            <p className="text-title2 font-semibold">MCP를 삭제하시겠습니까?</p>
                        </div>

                        {/* 보조 설명 */}
                        <p className="text-body3 text-secondary text-center">
                            해당 API KEY 값과 관련 정보가 모두 삭제됩니다.
                        </p>

                        {/* 하단 버튼 */}
                        <div className="flex justify-end gap-3">
                            <PrimaryButton
                                variant="secondary"
                                size="md"
                                additionalClassName="min-w-[96px] justify-center"
                                onClick={handleRequestClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton
                                size="md"
                                additionalClassName="min-w-[96px] justify-center"
                                onClick={handleConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Confirm"}
                            </PrimaryButton>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 완료 박스 */}
                        <div className="rounded-[20px] bg-surface-2 px-6 py-4 text-center">
                            <p className="text-title2 font-semibold">삭제되었습니다.</p>
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton
                                size="md"
                                additionalClassName="min-w-[96px] justify-center"
                                onClick={onClose}
                            >
                                Close
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    ) : null;
};

export default DeleteMcpFlowModal;
