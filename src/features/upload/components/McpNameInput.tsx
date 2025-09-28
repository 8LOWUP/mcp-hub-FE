"use client";

import { useState, ChangeEvent, forwardRef, KeyboardEvent } from "react";

interface MCPNameInputProps {
    onEnter?: () => void;
}

const MCPNameInput = forwardRef<HTMLInputElement, MCPNameInputProps>(
    (props, ref) => {
        const [name, setName] = useState<string>("");
        const [warning, setWarning] = useState<boolean>(false);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            if (value.length <= 30) {
                setName(value);
                setWarning(false);
            } else {
                setWarning(true);
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
