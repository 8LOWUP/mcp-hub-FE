"use client";

import React from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import ProfileSidebar from "./ProfileSidebar";
import type { SidebarKeyType } from "./constants";

export default function SidebarClient() {
    // profiles 레이아웃 하위 세그먼트: [], ["deployed"], ["support"]
    const segs = useSelectedLayoutSegments();

    const active: SidebarKeyType =
        segs.includes("deployed") ? "deployed" :
            segs.includes("support")  ? "support"  :
                "stored";

    return <ProfileSidebar activeKey={active} username="KIKI" />;
}
