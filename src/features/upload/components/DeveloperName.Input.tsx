"use client";
import { useState, useEffect, forwardRef, KeyboardEvent } from "react";

interface DeveloperNameInputProps {
    defaultValue?: string;   // ⬅️ 추가
    onEnter?: () => void;
}

const DeveloperNameInput = forwardRef<HTMLInputElement, DeveloperNameInputProps>(
    ({ defaultValue, onEnter }, ref) => {
        const [val, setVal] = useState("");

        // ✨ 프리필
        useEffect(() => {
            if (typeof defaultValue === "string") setVal(defaultValue);
        }, [defaultValue]);

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") { e.preventDefault(); onEnter?.(); }
        };

        return (
            <div className="mb-5">
                <label className="block mb-2 text-lg font-semibold text-white">Developer Name</label>
                <input
                    ref={ref}
                    type="text"
                    placeholder="e.g., KIKI KIM"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border-contrast rounded bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                />
            </div>
        );
    }
);

DeveloperNameInput.displayName = "DeveloperNameInput";
export default DeveloperNameInput;
