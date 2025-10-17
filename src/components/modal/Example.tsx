"use client";

import React from "react";
import { useTranslations } from "next-intl";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";


const Example: React.FC = () => {
    // Locale translations
    const t = useTranslations('Common');
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleDelete = () => alert(t('delete'));
    const handleSave = () => alert(t('edit'));

    return (
        <div className="p-6">
            <PrimaryButton onClick={handleOpen}>
                {t('openModal')}
            </PrimaryButton>

            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title={t('apiKeyManagement')}
                size="lg"
                footer={
                    <>
                        {/* 텍스트 버튼 느낌: 보조 톤 */}
                        <PrimaryButton onClick={handleDelete}>
                            {t('delete')}
                        </PrimaryButton>

                        {/* 강조 버튼: 포인트 색상 */}
                        <PrimaryButton onClick={handleSave} additionalClassName="bg-accent text-black hover:bg-accent-hover">
                            {t('edit')}
                        </PrimaryButton>
                    </>
                }
            >
                {/* 본문은 샘플: 공용 톤 적용 */}
                <div className="text-secondary">
                    {t('sampleContent')}
                </div>
            </BaseModal>
        </div>
    );
};

export default Example;
