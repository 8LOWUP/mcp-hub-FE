"use client";

import { CheckCircle2 } from "lucide-react";
import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";

interface Props {
    data: getMcpDetailResponse["result"];
}

export default function MarketTools({ data }: Props) {
    const tools = data?.tools ?? [];

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

            <TextContainer className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border border-contrast">
                {/* 왼쪽 컬럼 */}
                <div className="space-y-3">
                    {leftTools.map((tool, index) => {
                        const safeName = tool?.name || "내용 없음";
                        const safeContent = tool?.content || "내용 없음";

                        return (
                            <div
                                key={tool?.id ?? `left-${index}`} // ✅ null-safe key
                                className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                            >
                                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                                </div>
                                <div className="text-white leading-relaxed">
                                    {/* ✅ name 태그 스타일 적용 */}
                                    <span className="inline-block bg-amber-300/20 text-amber-300 border border-amber-300/30 text-xs font-semibold px-2 py-0.5 rounded-md mr-2">
                                        {safeName}
                                    </span>
                                    <span className="text-sm text-gray-300">{safeContent}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 오른쪽 컬럼 */}
                <div className="space-y-3">
                    {rightTools.map((tool, index) => {
                        const safeName = tool?.name || "이름 없음";
                        const safeContent = tool?.content || "내용 없음";

                        return (
                            <div
                                key={tool?.id ?? `right-${index}`} // ✅ null-safe key
                                className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                            >
                                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                                </div>
                                <div className="text-white leading-relaxed">
                                    <span className="inline-block bg-primary text-xs font-medium px-2 py-0.5 rounded-md mr-2">
                                        {safeName}
                                    </span>
                                    <span className="text-sm text-gray-300">{safeContent}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </TextContainer>
        </>
    );
}
