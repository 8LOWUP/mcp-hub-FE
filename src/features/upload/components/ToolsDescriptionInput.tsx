"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";

interface McpTool {
    name: string;
    content: string;
}

interface ToolsDescriptionInputProps {
    onChange?: (tools: McpTool[]) => void;
}

export default function ToolsDescriptionInput({ onChange }: ToolsDescriptionInputProps) {
    const [tools, setTools] = useState<McpTool[]>([{ name: "", content: "" }]);
    const [warning, setWarning] = useState<string>("");

    const handleChange = (index: number, field: keyof McpTool, value: string) => {
        const newTools = [...tools];
        newTools[index][field] = value;
        setTools(newTools);
    };

    const addTool = () => {
        if (tools.length >= 6) {
            setWarning("최대 6개까지만 추가할 수 있습니다.");
            return;
        }
        setTools([...tools, { name: "", content: "" }]);
        setWarning("");
    };

    const removeTool = (index: number) => {
        const newTools = tools.filter((_, i) => i !== index);
        setTools(newTools);
        setWarning("");
    };

    useEffect(() => {
        if (onChange) onChange(tools);
    }, [tools, onChange]);

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-white">
                Tools Description
            </label>

            {tools.map((tool, index) => (
                <motion.div
                    key={index}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    // ✅ 한 줄 정렬 (버튼까지 포함)
                    className="flex items-center gap-2 mb-2"
                >
                    {/* 입력 필드 두 개 */}
                    <div className="flex gap-3 flex-grow">
                        {/* Tool Name */}
                        <input
                            type="text"
                            placeholder="e.g., Tool name"
                            className="w-1/3 px-3 py-2 border border-contrast rounded bg-surface-2 text-white
                                       focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                            value={tool.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleChange(index, "name", e.target.value)
                            }
                        />

                        {/* Tool Content */}
                        <input
                            type="text"
                            placeholder="e.g., Finding word function"
                            className="w-2/3 px-3 py-2 border border-contrast rounded bg-surface-2 text-white
                                       focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                            value={tool.content}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleChange(index, "content", e.target.value)
                            }
                        />
                    </div>

                    {/* 삭제 버튼 */}
                    {(index !== tools.length - 1 || tools.length === 6) && (
                        <button
                            type="button"
                            onClick={() => removeTool(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg flex items-center justify-center"
                            title="삭제"
                        >
                            ×
                        </button>
                    )}

                    {/* 추가 버튼 (글씨에 맞게, 완전 중앙 정렬) */}
                    {index === tools.length - 1 && tools.length < 6 && (
                        <button
                            type="button"
                            onClick={addTool}
                            className="px-3 py-3 bg-accent rounded text-black text-sm font-medium
                                       flex items-center justify-center hover:opacity-90 transition whitespace-nowrap"
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
