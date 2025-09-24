"use client";

import { CheckCircle2 } from "lucide-react";
import TextContainer from "@/components/container/TextContainer";

interface Props {
    tools: string[];
}

export default function MarketTools({ tools }: Props) {
    // 툴을 반으로 나누어 왼쪽/오른쪽 컬럼 구성
    const mid = Math.ceil(tools.length / 2);
    const leftTools = tools.slice(0, mid);
    const rightTools = tools.slice(mid);

    return (
        <>
            {/* 큰 태그로 Tools 제목 */}
            <div className="text-secondary font-semibold text-lg">Tools</div>

            <TextContainer className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border border-contrast ">
                {/* 왼쪽 컬럼 */}
                <div className="space-y-3">
                    {leftTools.map((tool, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3  p-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-white leading-relaxed">{tool}</span>
                        </div>
                    ))}
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="space-y-3">
                    {rightTools.map((tool, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-white leading-relaxed">{tool}</span>
                        </div>
                    ))}
                </div>
            </TextContainer>
        </>
    );
}
