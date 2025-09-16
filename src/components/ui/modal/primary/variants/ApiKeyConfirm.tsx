// src/components/ui/modal/primary/variants/ApiKeyConfirm.tsx
"use client";

import PrimaryButton from "../../../PrimaryButton";
import type { PrimaryVariantProps } from "../registry";

const ApiKeyConfirm: React.FC<PrimaryVariantProps> = ({ onClose, go }) => {
    return (
        <>
            <h2 className="text-display1">API Key Management</h2>

            <div className="flex-1 flex items-center justify-center">
                <div className="px-6 py-4 rounded-[12px] bg-surface-2">
                    <p className="text-title1 text-primary">정말 삭제하시겠습니까?</p>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <PrimaryButton variant="secondary" size="md" onClick={() => go("apiKeyView")}>
                    <span className="text-title2">취소</span>
                </PrimaryButton>
                <PrimaryButton variant="primary" size="md" onClick={onClose}>
                    <span className="text-title2">삭제</span>
                </PrimaryButton>
            </div>
        </>
    );
};

export default ApiKeyConfirm;
