"use client";
import { useState, useEffect, ChangeEvent, forwardRef, KeyboardEvent } from "react";

interface ConnectionPlatformInputProps {
    defaultValue?: string;   // ⬅️ 추가
    onEnter?: () => void;
}

const ConnectionPlatformInput = forwardRef<HTMLInputElement, ConnectionPlatformInputProps>(
    ({ defaultValue, onEnter }, ref) => {
        const [value, setValue] = useState("");
        const [warning, setWarning] = useState(false);

        // ✨ 프리필
        useEffect(() => {
            if (typeof defaultValue === "string") setValue(defaultValue);
        }, [defaultValue]);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const items = inputValue.split(",").map((i) => i.trim()).filter(Boolean);
            if (items.length <= 1) {         // 경고 문구에 맞춰 1개 제한
                setValue(inputValue);
                setWarning(false);
            } else {
                setWarning(true);
            }
        };

        const handleBlur = () => {
            const formatted = value
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter(Boolean)
                .join(",");
            setValue(formatted);
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") { e.preventDefault(); onEnter?.(); }
        };

        return (
            <div className="mb-5">
                <label className="block mb-2 text-lg font-semibold text-white">Connection Platform</label>
                <input
                    ref={ref}
                    type="text"
                    placeholder="e.g., OpenAI"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border rounded bg-surface-2 text-white focus:outline-none focus:ring-2 transition
            ${warning ? "border-red-500 focus:ring-red-400" : "border-contrast focus:ring-yellow-200"}`}
                />
                {warning && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">최대 1개까지만 입력 가능합니다.</p>
                )}
            </div>
        );
    }
);

ConnectionPlatformInput.displayName = "ConnectionPlatformInput";
export default ConnectionPlatformInput;
