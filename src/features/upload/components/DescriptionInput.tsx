"use client";
import { useState, useEffect, ChangeEvent, forwardRef, KeyboardEvent } from "react";

interface DescriptionInputProps {
    defaultValue?: string;   // ⬅️ 추가
    onEnter?: () => void;
}

const DescriptionInput = forwardRef<HTMLTextAreaElement, DescriptionInputProps>(
    ({ defaultValue, onEnter }, ref) => {
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
                <label className="block mb-2 text-lg font-semibold text-white">Description</label>
                <textarea
                    ref={ref}
                    value={description}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what makes your MCP unique."
                    className={`w-full px-3 py-2 border rounded bg-surface-2 text-white focus:outline-none focus:ring-2 transition
            ${warning ? "border-red-500 focus:ring-red-400" : "border-contrast focus:ring-yellow-200"}`}
                />
                {warning && <p className="mt-1 text-sm text-red-500 animate-pulse">Description은 최대 100자까지 입력 가능합니다.</p>}
            </div>
        );
    }
);

DescriptionInput.displayName = "DescriptionInput";
export default DescriptionInput;
