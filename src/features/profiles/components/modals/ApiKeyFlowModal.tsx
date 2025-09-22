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

    const isDirty = React.useMemo(() => value.trim() !== apiKey.trim(), [value, apiKey]);

    React.useEffect(() => {
        if (!isOpen) return;
        setStep("manage");
        setValue(apiKey);
        setLoading(false);
        setError(null);
    }, [isOpen, apiKey]);

    /* 공통 헤더: 타이틀 + 닫기 버튼(X) */
    const ModalHeader = (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-title1 font-bold">API Key Management</h2>
            <button
                aria-label="모달 닫기"
                onClick={onClose}
                className="ml-2 hover:opacity-80 transition-opacity shrink-0"
            >
                <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 block"
                >
                    <path
                        d="M1 19L17 1M17 19L1 1"
                        stroke="#F6E577"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );

    /* ---------- 핸들러 ---------- */
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

    /* ---------- 스텝 뷰 ---------- */
    const ManageStep = (
        <div className="flex flex-col gap-6">
            {ModalHeader}

            <div>
                <label className="text-body3 text-secondary mb-2 block">
                    API key for confirm
                </label>

                <div
                    className={[
                        "group rounded-[12px] bg-surface-2 px-4 py-3",
                        "flex items-center gap-3",
                        "ring-0 transition-all duration-200",
                        "hover:opacity-95",
                        "focus-within:ring-2 focus-within:ring-accent",
                    ].join(" ")}
                >
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-transparent outline-none text-primary"
                        placeholder="Enter your API key"
                    />

                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        className={[
                            "shrink-0 transition-colors duration-200",
                            isDirty ? "text-accent" : "text-secondary",
                        ].join(" ")}
                        aria-hidden
                    >
                        <path
                            d="M16 6L8.5 14L4 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
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
    );

    const ConfirmDeleteStep = (
        <div className="flex flex-col gap-6">
            {ModalHeader}

            <div className="w-full rounded-[20px] bg-surface-2 px-6 py-4">
                <p className="text-title2 font-semibold text-center">정말 삭제 하시겠습니까?</p>
            </div>

            {error && <p className="text-body3 text-danger">{error}</p>}

            <div className="w-full flex justify-end">
                <PrimaryButton onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting..." : "Next"}
                </PrimaryButton>
            </div>
        </div>
    );

    const DoneDeleteStep = (
        <div className="flex flex-col gap-6">
            {ModalHeader}

            <div className="w-full rounded-[20px] bg-surface-2 px-6 py-4">
                <p className="text-title2 font-semibold text-center">API 키가 삭제되었습니다.</p>
            </div>

            <div className="w-full flex justify-end">
                <PrimaryButton onClick={onClose}>Done</PrimaryButton>
            </div>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="lg">
            {step === "manage" && ManageStep}
            {step === "confirmDelete" && ConfirmDeleteStep}
            {step === "doneDelete" && DoneDeleteStep}
        </BaseModal>
    );
};

export default ApiKeyFlowModal;
