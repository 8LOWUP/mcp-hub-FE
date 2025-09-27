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
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            await onConfirm();
            setStep("done");
        } catch (e) {
            console.error(e);
            // 필요시 에러 토스트/문구 추가
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="md">
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
                                className="min-w-[96px] justify-center"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton
                                size="md"
                                className="min-w-[96px] justify-center"
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
                                className="min-w-[96px] justify-center"
                                onClick={onClose}
                            >
                                Close
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    );
};

export default DeleteMcpFlowModal;
