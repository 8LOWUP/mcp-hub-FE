"use client";
import { useState, useEffect, ChangeEvent, forwardRef, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

interface DescriptionInputProps {
    defaultValue?: string;   // ⬅️ 추가
    onEnter?: () => void;
}

const DescriptionInput = forwardRef<HTMLTextAreaElement, DescriptionInputProps>(
    ({ defaultValue, onEnter }, ref) => {
        // Locale translations
        const t = useTranslations('UploadPage');
        const [description, setDescription] = useState("");
        const [warning, setWarning] = useState(false);

        // ✨ 프리필
        useEffect(() => {
            if (typeof defaultValue === "string") {
                setDescription(defaultValue);
                setWarning((defaultValue ?? "").length > 100);
            }
        }, [defaultValue]);

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (value.length <= 100) { setDescription(value); setWarning(false); }
            else { setWarning(true); }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onEnter?.(); }
        };

        return (
            <div className="mb-4">
                <label className="block mb-2 text-lg font-semibold --text-color-1">{t('description')}</label>
                <textarea
                    ref={ref}
                    value={description}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('descriptionPlaceholder')}
                    className={`w-full px-3 py-2 border rounded bg-surface-2 --text-color-1 focus:outline-none focus:ring-2 transition
            ${warning ? "border-red-500 focus:ring-red-400" : "border-contrast focus:ring-yellow-200"}`}
                />
                {warning && <p className="mt-1 text-sm text-red-500 animate-pulse">{t('descriptionLimit')}</p>}
            </div>
        );
    }
);

DescriptionInput.displayName = "DescriptionInput";
export default DescriptionInput;
