import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";  // ✅ 올바른 타입 import

interface Props {
    about?: getMcpDetailResponse["result"]["description"]; // optional
}

export default function McpAbout({ about }: Props) {
    return (
        <>
            <div className="text-secondary font-semibold text-lg">About</div>
            <TextContainer className="w-full border border-contrast text-left tracking-wide leading-relaxed text-white">
                {about || "No description available."} {/* ✅ fallback */}
            </TextContainer>
        </>
    );
}
