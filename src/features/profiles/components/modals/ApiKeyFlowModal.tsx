// src/features/profiles/components/modals/ApiKeyFlowModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Eye, EyeOff } from "lucide-react";
import { useWorkspaceMcpToken } from "@/features/profiles/hooks/useWorkspaceMcpToken";

type Step = "manage" | "confirmDelete" | "doneDelete";

export type ApiKeyFlowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    platformId: string; // ✅ 반드시 필요!
};

const ApiKeyFlowModal: React.FC<ApiKeyFlowModalProps> = ({ isOpen, onClose, platformId }) => {
    const [step, setStep] = React.useState<Step>("manage");
    const [value, setValue] = React.useState("");
    const [revealed, setRevealed] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const hasPrefilledRef = React.useRef(false);

    const { tokenQuery, saveToken, deleteToken, isSaving, isDeleting } =
        useWorkspaceMcpToken(platformId); // ✅ 여기로 전달

    // 모달 열릴 때 최신값 가져오고 한번만 프리필
    React.useEffect(() => {
        if (!isOpen || !platformId) return;
        hasPrefilledRef.current = false;
        tokenQuery.refetch().catch(() => void 0);
        setStep("manage");
        setRevealed(false);
        setError(null);
    }, [isOpen, platformId]); // eslint-disable-line

    React.useEffect(() => {
        if (!isOpen) return;
        if (!hasPrefilledRef.current) {
            setValue(tokenQuery.data?.token ?? "");
            hasPrefilledRef.current = true;
        }
    }, [isOpen, tokenQuery.data?.token]);

    const handleEdit = async () => {
        setError(null);
        if (!platformId) {
            setError("platformId가 없어 저장할 수 없습니다.");
            return;
        }
        const next = value.trim();
        if (!next) {
            setError("API 키를 입력해주세요.");
            return;
        }
        try {
            await saveToken(next);  // 훅에서 setQueryData로 즉시 반영
            onClose();
        } catch (e: any) {
            setError(e?.message ?? "저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const handleDelete = async () => {
        setError(null);
        if (!platformId) {
            setError("platformId가 없어 삭제할 수 없습니다.");
            return;
        }
        try {
            await deleteToken();
            setStep("doneDelete");
        } catch (e: any) {
            setError(e?.message ?? "삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="md">
            {step === "manage" && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-title1 font-bold">API Key Management</h2>

                    <div>
                        <label className="mb-2 block text-body3 text-secondary">
                            API key (입력 시 새 키로 교체됩니다)
                        </label>
                        <div className="group flex items-center gap-3 rounded-[12px] bg-surface-2 px-4 py-3">
                            <input
                                type={revealed ? "text" : "password"}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full bg-transparent text-primary outline-none"
                                placeholder="Enter your API key"
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
                        {error && <p className="mt-2 text-body3 text-danger">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <PrimaryButton onClick={handleDelete} disabled={isDeleting || !platformId}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </PrimaryButton>
                        <PrimaryButton onClick={handleEdit} disabled={isSaving || !platformId || !value.trim()}>
                            {isSaving ? "Saving..." : "Edit"}
                        </PrimaryButton>
                    </div>
                </div>
            )}

            {step === "doneDelete" && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-title1 font-bold">API Key Management</h2>
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
