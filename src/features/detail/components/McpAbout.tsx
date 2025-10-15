import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
import {FlagTriangleRight  } from "lucide-react";  // ✅ 올바른 타입 import

interface Props {
    about?: getMcpDetailResponse["result"]["description"]; // optional
}

export default function McpAbout({ about }: Props) {
    return (
        <>
            <div className="flex items-center gap-2 mb-1">
                <FlagTriangleRight className="w-5 h-5"/>
                <span className="text-white font-bold text-xl tracking-tight">About</span>
            </div>

            <TextContainer className="w-full border border-contrast text-left tracking-wide leading-relaxed text-white">
                {about || "작성된 설명이 없습니다."}
            </TextContainer>
        </>
    );
}
