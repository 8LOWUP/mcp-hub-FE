"use client";
import { forwardRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Props = { defaultValue?: string; onEnter?: () => void };

const LICENSES = [
    "MIT License",
    "GPL License",
    "Apache License 2.0",
    "Proprietary",
    "기타",
];

const LicenseInput = forwardRef<HTMLInputElement, Props>(({ defaultValue, onEnter }, ref) => {
    // Locale translations
    const t = useTranslations('UploadPage');
    const [selectedLicense, setSelectedLicense] = useState<string>("MIT License");
    const [customLicense, setCustomLicense] = useState<string>("");

    // ✨ 프리필: 기본값이 정해져 있으면 셋업
    useEffect(() => {
        if (!defaultValue) return;
        if (LICENSES.includes(defaultValue)) {
            setSelectedLicense(defaultValue);
            setCustomLicense("");
        } else {
            setSelectedLicense("기타");
            setCustomLicense(defaultValue);
        }
    }, [defaultValue]);

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-white">{t('license')}</label>

            <select
                value={selectedLicense}
                onChange={(e) => { setSelectedLicense(e.target.value); if (e.target.value !== "기타") setCustomLicense(""); }}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
            >
                {LICENSES.map((license) => (
                    <option key={license} value={license}>{license}</option>
                ))}
            </select>

            {selectedLicense === "기타" && (
                <input
                    type="text"
                    placeholder={t('licensePlaceholder')}
                    value={customLicense}
                    onChange={(e) => setCustomLicense(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter?.(); } }}
                    className="mt-3 w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />
            )}

            {/* 숨겨진 input: 선택값 or 커스텀 값 전달 */}
            <input type="hidden" ref={ref} value={selectedLicense === "기타" ? customLicense : selectedLicense} />
        </div>
    );
});

LicenseInput.displayName = "LicenseInput";
export default LicenseInput;
