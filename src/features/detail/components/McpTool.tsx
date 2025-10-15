"use client";

import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
import { Hammer } from "lucide-react";

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

    return (
        <>
            <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5" />
                <span className="text-white font-bold text-xl tracking-tight">Tools</span>
            </div>
            {/* ✅ 전체 배경색 제거 */}
            <TextContainer className="w-full flex flex-col gap-3  border border-contrast bg-transparent">
                {tools.map((tool, index) => {
                    const safeName = tool?.name || "이름 없음";
                    const safeContent = tool?.content || "내용 없음";

                    return (
                        <div
                            key={tool?.id ?? index}
                            className="p-4 rounded-xl border border-white/10 hover:border-amber-300/40 hover:bg-white/5 transition-all duration-200"
                        >
                            <div className="text-white font-semibold text-sm mb-2">
                <span className="inline-block bg-amber-300/20 text-amber-300 border border-amber-300/30 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {safeName}
                </span>
                            </div>
                            <div
                                className="text-sm text-gray-300 leading-relaxed line-clamp-2"
                                style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                }}
                            >
                                {safeContent}
                            </div>
                        </div>
                    );
                })}
            </TextContainer>
        </>
    );
}
