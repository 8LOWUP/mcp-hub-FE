"use client";

import React from "react";
import { useTranslations } from "next-intl";

const LLMHeader: React.FC = () => {
    const t = useTranslations('ProfilePage');

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    {t('llmTokens')}
                </h1>
                <p className="text-muted-foreground mt-1">
                    LLM 서비스 토큰을 관리하고 설정하세요
                </p>
            </div>
        </div>
    );
};

export default LLMHeader;
