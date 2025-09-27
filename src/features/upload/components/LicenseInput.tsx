"use client";

import { useState, ChangeEvent, forwardRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LicenseInputProps {
    onEnter?: () => void;
}

const LicenseInput = forwardRef<HTMLDivElement, LicenseInputProps>(
    (props, ref) => {
        const [selectedLicense, setSelectedLicense] = useState("");
        const [customLicense, setCustomLicense] = useState("");

        const licenses = [
            "MIT License",
            "GPL License",
            "Apache License 2.0",
            "Proprietary",
            "기타",
        ];

        const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
            setSelectedLicense(e.target.value);
            if (e.target.value !== "기타") {
                setCustomLicense("");
            }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (props.onEnter) {
                    props.onEnter();
                }
            }
        };

        return (
            <div ref={ref} className="mb-6">
                <label className="block mb-2 text-lg font-semibold text-white">
                    License
                </label>

                {/* 드롭다운 */}
                <select
                    value={selectedLicense}
                    onChange={handleSelectChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                >
                    <option value="">라이선스를 선택하세요</option>
                    {licenses.map((license, idx) => (
                        <option key={idx} value={license}>
                            {license}
                        </option>
                    ))}
                </select>

                {/* 기타 입력창 (애니메이션 포함) */}
                <AnimatePresence>
                    {selectedLicense === "기타" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3"
                        >
                            <input
                                type="text"
                                placeholder="직접 입력"
                                value={customLicense}
                                onChange={(e) => setCustomLicense(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

LicenseInput.displayName = "LicenseInput";

export default LicenseInput;
