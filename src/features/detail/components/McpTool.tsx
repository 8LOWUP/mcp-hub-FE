// src/features/detail/components/McpTool.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types"; // ✅ 타입 import

interface Props {
    data: getMcpDetailResponse["result"]; // ✅ data 안에 tools 포함
}

export default function MarketTools({ data }: Props) {
    const tools = data?.tools ?? []; // ✅ 안전하게 꺼내오기

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
                            className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            </div>
                            <div className="text-white leading-relaxed">
                                <div className="font-semibold">{tool.name}</div>
                                <div className="text-sm text-gray-300">{tool.content}</div>
                            </div>
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
                            <div className="text-white leading-relaxed">
                                <div className="font-semibold">{tool.name}</div>
                                <div className="text-sm text-gray-300">{tool.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </TextContainer>
        </>
    );
}
