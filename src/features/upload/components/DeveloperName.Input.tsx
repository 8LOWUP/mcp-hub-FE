"use client";

import { forwardRef, KeyboardEvent } from "react";

interface DeveloperNameInputProps {
    onEnter?: () => void;
}

const DeveloperNameInput = forwardRef<HTMLInputElement, DeveloperNameInputProps>(
    (props, ref) => {
        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (props.onEnter) {
                    props.onEnter();
                }
            }
        };

        return (
            <div className="mb-5">
                <label className="block mb-2 text-lg font-semibold text-white">
                    Developer Name
                </label>
                <input
                    ref={ref}
                    type="text"
                    placeholder="e.g., KIKI KIM"
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border-contrast rounded bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                />
            </div>
        );
    }
);

DeveloperNameInput.displayName = "DeveloperNameInput";

export default DeveloperNameInput;
