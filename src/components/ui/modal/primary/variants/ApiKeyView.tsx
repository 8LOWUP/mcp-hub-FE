// src/components/ui/modal/primary/variants/ApiKeyView.tsx
"use client";

import PrimaryButton from "../../../PrimaryButton";
import type { PrimaryVariantProps } from "../registry";

const ApiKeyView: React.FC<PrimaryVariantProps> = ({ onClose, go }) => {
    return (
        <>
            {/* 제목 */}
            <h2 className="text-display1">API Key Management</h2>

            {/* 입력 */}
            <div className="space-y-2">
                <p className="text-title2 text-secondary">API key for confirm</p>
                <div className="flex items-center gap-2">
                    <input
                        readOnly
                        value="90193049dklfkaJfjo94809dsakljfkjd"
                        className="
              flex-1 rounded-md
              bg-surface-2 px-4 py-2
              text-body3 text-white outline-none
            "
                    />
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-accent">
                        <span className="text-black font-bold">✓</span>
                    </div>
                </div>
            </div>

            {/* 액션 */}
            <div className="flex justify-end gap-4">
                <PrimaryButton variant="secondary" size="md" onClick={() => go("apiKeyConfirm")}>
                    <span className="text-title2">삭제</span>
                </PrimaryButton>
                <PrimaryButton variant="primary" size="md">
                    <span className="text-title2">수정</span>
                </PrimaryButton>
            </div>
        </>
    );
};

export default ApiKeyView;
