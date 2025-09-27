"use client";
import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

export default function ToolsDescriptionInput() {
    const [descriptions, setDescriptions] = useState<string[]>([""]);
    const [warning, setWarning] = useState<string>("");

    const handleChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

    const addDescription = () => {
        if (descriptions.length >= 6) {
            setWarning("최대 6개까지만 추가할 수 있습니다.");
            return;
        }
        setDescriptions([...descriptions, ""]);
        setWarning("");
    };

    const removeDescription = (index: number) => {
        const newDescriptions = descriptions.filter((_, i) => i !== index);
        setDescriptions(newDescriptions);
        setWarning("");
    };

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-white">
                Tools Description
            </label>

            {descriptions.map((desc, index) => (
                <motion.div
                    key={index}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center mb-2"
                >
                    <input
                        type="text"
                        placeholder="e.g., Finding word function"
                        className="flex-1 px-3 py-2 border border-contrast rounded bg-surface-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                        value={desc}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(index, e.target.value)
                        }
                    />

                    {(index !== descriptions.length - 1 || descriptions.length === 6) && (
                        <button
                            type="button"
                            onClick={() => removeDescription(index)}
                            className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                            title="삭제"
                        >
                            x
                        </button>
                    )}

                    {index === descriptions.length - 1 && descriptions.length < 6 && (
                        <button
                            type="button"
                            onClick={addDescription}
                            className="ml-2 px-3 py-2 bg-accent rounded text-black"
                        >
                            + 추가
                        </button>
                    )}
                </motion.div>
            ))}

            {warning && <p className="mt-2 text-red-500">{warning}</p>}
        </div>
    );
}
