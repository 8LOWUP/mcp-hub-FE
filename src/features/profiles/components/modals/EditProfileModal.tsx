// src/features/profiles/components/modals/EditProfileModal.tsx
"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";

export type EditProfileFormType = {
    email: string;
    nickname: string;
};

type Props = {
    isOpen: boolean;
    defaultValues: Partial<EditProfileFormType>;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: EditProfileFormType) => Promise<void> | void;
};

const EditProfileModal: React.FC<Props> = ({
                                               isOpen,
                                               defaultValues,
                                               isSubmitting = false,
                                               onClose,
                                               onSubmit,
                                           }) => {
    const [email, setEmail] = React.useState(defaultValues.email ?? "");
    const [nickname, setNickname] = React.useState(defaultValues.nickname ?? "");

    React.useEffect(() => {
        setEmail(defaultValues.email ?? "");
        setNickname(defaultValues.nickname ?? "");
    }, [defaultValues.email, defaultValues.nickname, isOpen]);

    const handleSubmit = async () => {
        await onSubmit({ email, nickname });
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            size="sm"
            footer={
                <div className="flex w-full justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded-2xl bg-surface-2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-2xl bg-accent text-black"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-body3 mb-1">Email</label>
                    <input
                        className="w-full rounded-xl border border-contrast bg-surface-1 px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-body3 mb-1">Nickname</label>
                    <input
                        className="w-full rounded-xl border border-contrast bg-surface-1 px-3 py-2"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                    />
                </div>
            </div>
        </BaseModal>
    );
};

export default EditProfileModal;
