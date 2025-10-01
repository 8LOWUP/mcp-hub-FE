// src/features/detail/components/McpTool.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import TextContainer from "@/components/container/TextContainer";
import type { McpTool } from "@/types/detail/detail-types";

interface Props {
    tools?: McpTool[]; // optional로 받아도 안전
}

export default function MarketTools({ tools = [] }: Props) {
    if (tools.length === 0) {
        return (
            <div>
                <div className="text-secondary font-semibold text-lg">Tools</div>
                <TextContainer className="w-full text-gray-400 text-sm p-4">
                    등록된 Tool이 없습니다.
                </TextContainer>
            </div>
        );
    }

    const mid = Math.ceil(tools.length / 2);
    const leftTools = tools.slice(0, mid);
    const rightTools = tools.slice(mid);

    return (
        <>
            <div className="text-secondary font-semibold text-lg">Tools</div>

            <TextContainer className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border border-contrast ">
                {/* 왼쪽 컬럼 */}
                <div className="space-y-3">
                    {leftTools.map((tool) => (
                        <div
                            key={tool.id}
                            className="flex items-start gap-3  p-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-white leading-relaxed">
                                {tool.content}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="space-y-3">
                    {rightTools.map((tool) => (
                        <div
                            key={tool.id}
                            className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-white leading-relaxed">
                                {tool.content}
                            </span>
                        </div>
                    ))}
                </div>
            </TextContainer>
        </>
    );
}
