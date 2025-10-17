import TextContainer from "@/components/container/TextContainer";
import type { getMcpDetailResponse } from "@/types/detail/detail-types";
import {FlagTriangleRight  } from "lucide-react";  // ✅ 올바른 타입 import
import { useTranslations } from "next-intl";

interface Props {
    about?: getMcpDetailResponse["result"]["description"]; // optional
}

export default function McpAbout({ about }: Props) {
    // Locale translations
    const t = useTranslations('DetailPage');
    
    return (
        <>
            <div className="flex items-center gap-2 mb-1">
                <FlagTriangleRight className="w-5 h-5"/>
                <span className="--text-color-1 font-bold text-xl tracking-tight">{t('about')}</span>
            </div>

            <TextContainer className="w-full border border-contrast text-left tracking-wide leading-relaxed --text-color-1">
                {about || t('noDescription')}
            </TextContainer>
        </>
    );
}
