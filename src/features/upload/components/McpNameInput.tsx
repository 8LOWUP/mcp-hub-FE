"use client";

import { useState, useEffect, ChangeEvent, forwardRef, KeyboardEvent } from "react";

interface MCPNameInputProps {
    defaultValue?: string;      // ✅ 부모가 내려주는 초기값 (편집 모드에서 서버값)
    onEnter?: () => void;
    onChange?: (value: string) => void; // (선택) 부모에게 변경 알림
}

const MCPNameInput = forwardRef<HTMLInputElement, MCPNameInputProps>(
    ({ defaultValue, onEnter, onChange }, ref) => {
        const [name, setName] = useState<string>("");
        const [warning, setWarning] = useState<boolean>(false);

        // ✅ 서버값/초기값이 바뀔 때 state에 주입 (프리필 핵심)
        useEffect(() => {
            if (typeof defaultValue === "string") {
                setName(defaultValue);
                setWarning(defaultValue.length > 30);
            }
        }, [defaultValue]);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            // 길이 제한
            if (value.length <= 30) {
                setName(value);
                setWarning(false);
                onChange?.(value);
            } else {
                setWarning(true);
            }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                onEnter?.();
            }
        };

        return (
            <div className="mb-4">
                <label className="block mb-2 text-lg font-semibold text-white">
                    Mcp Name
                </label>
                <input
                    ref={ref}
                    type="text"
                    value={name}                            
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., My Awesome Server"
                    className={`w-full px-3 py-2 border rounded bg-surface-2 text-white focus:outline-none focus:ring-2 transition
            ${warning ? "border-red-500 focus:ring-red-400" : "border-contrast focus:ring-yellow-200"}`}
                />
                {warning && (
                    <p className="mt-1 text-sm text-red-500 animate-pulse">
                        이름은 30자 이하로 입력해주세요.
                    </p>
                )}
            </div>
        );
    }
);

MCPNameInput.displayName = "MCPNameInput";
export default MCPNameInput;
