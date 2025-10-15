// src/features/profiles/components/modals/ApiKeyFlowModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Step = "manage" | "confirmDelete" | "doneDelete";

export type ApiKeyFlowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    apiKey?: string;
    onEdit?: (nextKey: string) => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
};

const ApiKeyFlowModal: React.FC<ApiKeyFlowModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             apiKey = "",
                                                             onEdit,
                                                             onDelete,
                                                         }) => {
    const [step, setStep] = React.useState<Step>("manage");
    const [value, setValue] = React.useState(apiKey);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        setStep("manage");
        setValue(apiKey);
        setLoading(false);
        setError(null);
    }, [isOpen, apiKey]);

    const toConfirmDelete = () => {
        setError(null);
        setStep("confirmDelete");
    };

    const handleEdit = async () => {
        setError(null);
        try {
            setLoading(true);
            await onEdit?.(value.trim());
            onClose();
        } catch {
            setError("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError(null);
        try {
            setLoading(true);
            await onDelete?.();
            setStep("doneDelete");
        } catch {
            setError("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    const ModalHeader = (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-title1 font-bold">API Key Management</h2>
            <button aria-label="모달 닫기" onClick={onClose} className="ml-2 shrink-0 transition-opacity hover:opacity-80">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="block h-5 w-5">
                    <path d="M1 19L17 1M17 19L1 1" stroke="#F6E577" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );

    // ✅ BaseModal가 어떤 prop을 기대하든 열리도록 양쪽 다 전달
    const modalProps: any = {
        isOpen,                // 우리 쪽 prop
        onClose,               // 우리 쪽 prop
        open: isOpen,          // shadcn/Dialog 스타일 호환
        onOpenChange: (v: boolean) => { if (!v) onClose(); },
        size: "md",
        className: "z-[9999]", // 가려짐 방지
    };

    return (
        <BaseModal {...modalProps}>
            {step === "manage" && (
                <div className="flex flex-col gap-6">
                    {ModalHeader}
                    <div>
                        <label className="mb-2 block text-body3 text-secondary">API key for confirm</label>
                        <div
                            className={[
                                "group flex items-center gap-3 rounded-[12px] bg-surface-2 px-4 py-3",
                                "ring-0 transition-all duration-200 hover:opacity-95",
                                "focus-within:ring-2 focus-within:ring-accent",
                            ].join(" ")}
                        >
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full bg-transparent text-primary outline-none"
                                placeholder="Enter your API key"
                            />
                        </div>
                        {error && <p className="mt-2 text-body3 text-danger">{error}</p>}
                    </div>
                    <div className="flex justify-end gap-3">
                        <PrimaryButton onClick={toConfirmDelete} disabled={loading}>
                            Delete
                        </PrimaryButton>
                        <PrimaryButton onClick={handleEdit} disabled={loading || !value.trim()}>
                            {loading ? "Saving..." : "Edit"}
                        </PrimaryButton>
                    </div>
                </div>
            )}

            {step === "confirmDelete" && (
                <div className="flex flex-col gap-6">
                    {ModalHeader}
                    <div className="w-full rounded-[20px] bg-surface-2 px-6 py-4">
                        <p className="text-center text-title2 font-semibold">정말 삭제 하시겠습니까?</p>
                    </div>
                    {error && <p className="text-body3 text-danger">{error}</p>}
                    <div className="flex w-full justify-end">
                        <PrimaryButton onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Next"}
                        </PrimaryButton>
                    </div>
                </div>
            )}

            {step === "doneDelete" && (
                <div className="flex flex-col gap-6">
                    {ModalHeader}
                    <div className="w-full rounded-[20px] bg-surface-2 px-6 py-4">
                        <p className="text-center text-title2 font-semibold">API 키가 삭제되었습니다.</p>
                    </div>
                    <div className="flex w-full justify-end">
                        <PrimaryButton onClick={onClose}>Done</PrimaryButton>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};

export default ApiKeyFlowModal;
