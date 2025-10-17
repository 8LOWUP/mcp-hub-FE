"use client";
import { forwardRef, useEffect, useState } from "react";

type Props = { defaultValue?: string; onEnter?: () => void };

const LICENSES = [
    "MIT License",
    "GPL License",
    "Apache License 2.0",
    "Proprietary",
    "기타",
];

const LicenseInput = forwardRef<HTMLInputElement, Props>(({ defaultValue, onEnter }, ref) => {
    const [selectedLicense, setSelectedLicense] = useState<string>("MIT License");

    // ✨ 프리필: 기본값이 정해져 있으면 셋업
    useEffect(() => {
        if (!defaultValue) return;
        if (LICENSES.includes(defaultValue)) {
            setSelectedLicense(defaultValue);
        } else {
            // 기본값이 목록에 없을 때도 기타로 설정
            setSelectedLicense("기타");
        }
    }, [defaultValue]);

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-white">License</label>

            <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onEnter?.();
                    }
                }}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
            >
                {LICENSES.map((license) => (
                    <option key={license} value={license}>
                        {license}
                    </option>
                ))}
            </select>

            {/* 숨겨진 input: 선택된 값 전달 */}
            <input type="hidden" ref={ref} value={selectedLicense} />
        </div>
    );
});

LicenseInput.displayName = "LicenseInput";
export default LicenseInput;
