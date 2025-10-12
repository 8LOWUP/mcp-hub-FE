// src/features/upload/components/LicenseInput.tsx
"use client";

import { forwardRef, useState } from "react";

// forwardRef → useUploadForm에서 licenseRef로 값 읽기 가능
const LicenseInput = forwardRef<HTMLInputElement, { onEnter?: () => void }>(
    ({ onEnter }, ref) => {
        const licenses = [
            "MIT License",
            "GPL License",
            "Apache License 2.0",
            "Proprietary",
            "기타",
        ];

        const [selectedLicense, setSelectedLicense] = useState<string>("MIT License");
        const [customLicense, setCustomLicense] = useState<string>("");

        const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedLicense(e.target.value);
            if (e.target.value !== "기타") {
                setCustomLicense("");
            }
        };

        return (
            <div className="mb-6">
                <label className="block mb-2 text-lg font-semibold text-white">
                    License
                </label>

                {/* 드롭다운 */}
                <select
                    value={selectedLicense}
                    onChange={handleSelectChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                >
                    {licenses.map((license, idx) => (
                        <option key={idx} value={license}>
                            {license}
                        </option>
                    ))}
                </select>

                {/* 기타 입력창 */}
                {selectedLicense === "기타" && (
                    <input
                        type="text"
                        placeholder="직접 입력"
                        value={customLicense}
                        onChange={(e) => setCustomLicense(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && onEnter) {
                                e.preventDefault();
                                onEnter();
                            }
                        }}
                        className="mt-3 w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                    />
                )}

                {/* ✅ 숨겨진 input: 선택값 or 커스텀 값 전달 */}
                <input
                    type="hidden"
                    ref={ref}
                    value={selectedLicense === "기타" ? customLicense : selectedLicense}
                />
            </div>
        );
    }
);

LicenseInput.displayName = "LicenseInput";
export default LicenseInput;
