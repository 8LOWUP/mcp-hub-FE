"use client";

import React from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useTranslations } from "next-intl";
import ProfileSidebar from "./ProfileSidebar";
import type { SidebarKeyType } from "./constants";

export default function SidebarClient() {
    // Locale translations
    const t = useTranslations('ProfilePage');
    // profiles 레이아웃 하위 세그먼트: [], ["deployed"], ["support"]
    const segs = useSelectedLayoutSegments();

    const active: SidebarKeyType =
        segs.includes("deployed") ? "deployed" :
            segs.includes("llm-manage") ? "llmManage" :
                segs.includes("support")  ? "support"  :
                    "stored";

    return <ProfileSidebar activeKey={active} username={t('defaultUser')} />;
}
