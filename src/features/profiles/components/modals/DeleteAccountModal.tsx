"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
    // Locale translations
    const t = useTranslations('ProfilePage');
    const router = useRouter();
    const [step, setStep] = React.useState<DeleteStep>(DeleteStep.confirm);
    const [isLoading, setIsLoading] = React.useState(false);

    // 모달이 열릴 때마다 초기 단계로 리셋
    React.useEffect(() => {
        if (isOpen) setStep(DeleteStep.confirm);
    }, [isOpen]);

    const handleNextFromConfirm = async () => {
        try {
            setIsLoading(true);
            await onRequestDelete();
            setStep(DeleteStep.done);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        onClose();
        router.push("/ko"); // 완료 후 이동
    };

    const isConfirm = step === DeleteStep.confirm;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('deleteAccount')}
            size="md"
        >
            {/* 본문 */}
            <div className="space-y-6">
                {isConfirm ? (
                    <>
                        <div className="rounded-2xl bg-surface-2 px-6 py-5 text-center">
                            <p className="text-title3">{t('deleteAccountConfirm')}</p>
                        </div>
                        <p className="text-body3 text-secondary text-center">
                            {t('deleteAccountWarning')}
                        </p>
                    </>
                ) : (
                    <div className="rounded-2xl bg-surface-2 px-6 py-5 text-center">
                        <p className="text-title3">{t('deleteAccountComplete')}</p>
                    </div>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="mt-8 flex justify-end gap-3">
                {isConfirm ? (
                    <>
                        <PrimaryButton
                            variant="secondary"
                            size="md"
                            additionalClassName="min-w-[96px] justify-center"
                            onClick={onClose}
                        >
                            Cancel
                        </PrimaryButton>

                        <PrimaryButton
                            size="md"
                            additionalClassName="min-w-[96px] justify-center"
                            onClick={handleNextFromConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Next"}
                        </PrimaryButton>
                    </>
                ) : (
                    <PrimaryButton
                        size="md"
                        additionalClassName="min-w-[96px] justify-center"
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
