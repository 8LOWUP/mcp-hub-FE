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

    // 프리필 제어 및 안전 동기화용 레퍼런스
    const hasPrefilledRef = React.useRef(false);
    const prevFromQueryRef = React.useRef<string | undefined>(undefined);

    const { tokenQuery, saveToken, deleteToken, isSaving, isDeleting } = useWorkspaceMcpToken(platformId);

    // 모달 열릴 때 상태 초기화 + (선택) 최신값 강제 fetch
    React.useEffect(() => {
        if (!isOpen || !platformId) return;
        hasPrefilledRef.current = false;
        prevFromQueryRef.current = undefined;

        setStep("manage");
        setRevealed(false);
        setError(null);

        // 훅에서 onSettled에 invalidate가 있어 자동 동기화되지만,
        // 열릴 때 항상 최신값을 보고 싶으면 refetch 유지
        tokenQuery.refetch().catch(() => void 0);
    }, [isOpen, platformId]); // eslint-disable-line

    // ✅ 쿼리값 → 로컬 state 동기화(사용자 입력을 덮어쓰지 않도록 보호)
    React.useEffect(() => {
        if (!isOpen) return;
        const token = tokenQuery.data?.token ?? "";

        // 1) 최초 1회 프리필, 또는
        // 2) 사용자가 아직 쿼리에서 가져온 값 그대로 두고 있을 때(value === prevFromQuery)
        if (!hasPrefilledRef.current || value === prevFromQueryRef.current) {
            setValue(token);
            hasPrefilledRef.current = true;
        }

        // 다음 비교를 위해 현재 쿼리값 저장
        prevFromQueryRef.current = token;
        // value는 의존성에 넣지 말 것(사용자 타이핑 시 동기화가 과하게 개입하게 됨)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            await saveToken(next);       // 훅 onMutate에서 캐시 즉시 갱신
            setValue(next);              // ✅ 입력창도 즉시 동기화
            hasPrefilledRef.current = true;
            onClose();                   // 필요 시 유지/제거 가능
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
            setValue("");                // ✅ 입력창도 즉시 비우기
            hasPrefilledRef.current = true;
            setStep("doneDelete");
        } catch (e: any) {
            setError(e?.message ?? "삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="md">
            {step === "manage" && (
                <div className="flex flex-col gap-6">
                    <div className="relative">
                        <h2 className="text-title1 font-bold">API Key Management</h2>
                        {/* X 버튼 */}
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

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

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || !platformId}
                            className="text-body3 text-danger hover:text-danger-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
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
