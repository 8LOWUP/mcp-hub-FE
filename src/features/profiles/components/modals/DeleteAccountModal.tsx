// src/features/profiles/components/DeleteAccountModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";

type DeleteAccountModalProps = {
    isOpen: boolean;
    onClose: () => void;
    /** 실제 탈퇴 API를 실행하는 함수. 성공하면 resolve, 실패하면 throw */
    onRequestDelete: () => Promise<void>;
};

enum DeleteStep {
    confirm = "confirm",
    done = "done",
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onRequestDelete,
                                                               }) => {
    const router = useRouter();
    const [step, setStep] = React.useState<DeleteStep>(DeleteStep.confirm);
    const [isLoading, setIsLoading] = React.useState(false);

    // 모달이 열릴 때마다 초기 단계로 리셋
    React.useEffect(() => {
        if (isOpen) setStep(DeleteStep.confirm);
    }, [isOpen]);

    const handleNextFromConfirm = async () => {
        // 1) 탈퇴 API 호출 → 2) 성공 시 완료 단계로 전환
        try {
            setIsLoading(true);
            await onRequestDelete();
            setStep(DeleteStep.done);
        } catch (e) {
            // 실패 처리(UI 토스트/문구 추가 가능)
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        onClose();          // 모달 닫기
        router.push("/ko"); // 완료 후 이동
    };

    const isConfirm = step === DeleteStep.confirm;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Account"
            className="w-[600px] max-w-[90%] rounded-[20px]"

        >
            {/* 본문 */}
            <div className="space-y-6">
                {isConfirm ? (
                    <>
                        <div className="rounded-2xl bg-surface-2 px-6 py-5 text-center">
                            <p className="text-title3">정말 탈퇴하시겠습니까?</p>
                        </div>
                        <p className="text-body3 text-secondary text-center">
                            탈퇴하면 남는거 뭐도 없는데 괜춘?
                        </p>
                    </>
                ) : (
                    <>
                        <div className="rounded-2xl bg-surface-2 px-6 py-5 text-center">
                            <p className="text-title3">회원탈퇴가 완료되었습니다.</p>
                        </div>
                    </>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-end gap-3">
                {isConfirm ? (
                    <>
                        <PrimaryButton
                            variant="secondary" // 👉 Secondary 스타일 적용(회색 계열)
                            size="md"
                            className="min-w-[96px] justify-center"
                            onClick={onClose} // 👉 모달 닫기
                        >
                            Cancel
                        </PrimaryButton>

                        <PrimaryButton
                            size="md"
                            className="min-w-[96px] justify-center"
                            onClick={handleNextFromConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Next"}
                        </PrimaryButton>
                    </>
                ) : (
                    <PrimaryButton
                        size="md"
                        className="min-w-[96px] justify-center"
                        onClick={handleFinish}
                    >
                        Next
                    </PrimaryButton>
                )}
            </div>

        </BaseModal>
    );
};

export default DeleteAccountModal;
