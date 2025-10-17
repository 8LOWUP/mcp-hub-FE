"use client";
import { useState, useEffect, useRef } from "react";

interface McpTool {
    name: string;
    content: string;
}
interface ToolsDescriptionInputProps {
    initialTools?: McpTool[];
    onChange?: (tools: McpTool[]) => void;
}

const sanitize = (arr?: McpTool[]): McpTool[] => {
    const base =
        Array.isArray(arr) && arr.length > 0
            ? arr
            : [{ name: "", content: "" }];
    return base.map((t) => ({
        name: (t?.name ?? "").toString(),
        content: (t?.content ?? "").toString(),
    }));
};

export default function ToolsDescriptionInput({
                                                  initialTools,
                                                  onChange,
                                              }: ToolsDescriptionInputProps) {
    // 최초 한 번 초기화
    const [tools, setTools] = useState<McpTool[]>(() => sanitize(initialTools));

    // 🔒 동일한 값이면 setState 생략 (무한 루프 차단)
    const lastInitJson = useRef<string>(
        JSON.stringify(sanitize(initialTools))
    );

    useEffect(() => {
        const nextJson = JSON.stringify(sanitize(initialTools));
        if (lastInitJson.current !== nextJson) {
            lastInitJson.current = nextJson;
            setTools(JSON.parse(nextJson));
        }
    }, [initialTools]);

    // 변경사항 부모에 반영 (빈 항목 제외)
    useEffect(() => {
        const validTools = tools.filter(
            (t) =>
                t.name.trim() !== "" ||
                t.content.trim() !== ""
        );
        onChange?.(validTools);
    }, [tools, onChange]);

    const handleChange = (
        index: number,
        field: keyof McpTool,
        value: string
    ) => {
        setTools((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addTool = () => {
        setTools((prev) =>
            prev.length >= 6
                ? prev
                : [...prev, { name: "", content: "" }]
        );
    };

    const removeTool = (index: number) => {
        setTools((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold --text-color-1">
                Tools Description
            </label>

            {tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <div className="flex gap-3 flex-grow">
                        <input
                            type="text"
                            placeholder="e.g., Tool name"
                            className="w-1/3 px-3 py-2 border border-contrast rounded bg-surface-2 --text-color-2 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                            value={tool.name ?? ""}
                            onChange={(e) =>
                                handleChange(index, "name", e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="e.g., Finding word function"
                            className="w-2/3 px-3 py-2 border border-contrast rounded bg-surface-2 --text-color-2 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
                            value={tool.content ?? ""}
                            onChange={(e) =>
                                handleChange(index, "content", e.target.value)
                            }
                        />
                    </div>

                    {tools.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeTool(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                        >
                            ×
                        </button>
                    )}

                    {index === tools.length - 1 && tools.length < 6 && (
                        <button
                            type="button"
                            onClick={addTool}
                            className="px-3 py-3 bg-accent rounded text-black text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
                        >
                            + 추가
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
