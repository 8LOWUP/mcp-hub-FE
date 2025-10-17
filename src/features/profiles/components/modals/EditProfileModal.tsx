"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
    // Locale translations
    const t = useTranslations('ProfilePage');
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
            title={t('editProfile')}
            size="sm"
            footer={
                <div className="flex w-full justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded-2xl bg-surface-2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        className="px-4 py-2 rounded-2xl bg-accent text-black"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('saving') : t('save')}
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* ✅ 이메일은 수정 불가 (readOnly + 회색처리) */}
                <div>
                    <label className="block text-body3 mb-1">{t('email')}</label>
                    <input
                        className="w-full rounded-xl border border-contrast bg-surface-1 px-3 py-2 text-gray-400 cursor-not-allowed focus:outline-none focus:ring-0 focus:border-contrast"
                        value={email}
                        readOnly
                        placeholder={t('emailPlaceholder')}
                    />
                </div>


                {/* 닉네임은 수정 가능 */}
                <div>
                    <label className="block text-body3 mb-1">{t('nickname')}</label>
                    <input
                        className="w-full rounded-xl border border-contrast bg-surface-1 px-3 py-2"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t('nicknamePlaceholder')}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

export default EditProfileModal;
