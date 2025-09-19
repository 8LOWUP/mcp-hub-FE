// src/features/profiles/components/sidebar/SidebarNav.tsx
"use client";

import React from "react";
import { PROFILE_NAV_ITEMS, SidebarKeyType } from "./constants";
import SidebarNavItem from "./SidebarNavItem";

type SidebarNavProps = {
    activeKey: SidebarKeyType;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ activeKey }) => {
    return (
        <nav
            aria-label="Profile navigation"
            className="space-y-3"
            style={
                {
                    // ⬇︎ 이 두 변수는 '사이드바 네브' 안에서만 유효
                    ["--sb-nav-btn-bg" as any]: "var(--bg-color-1)",        // 기본 배경
                    ["--sb-nav-btn-bg-hover" as any]: "var(--bg-color-3)",  // hover 배경
                } as React.CSSProperties
            }
        >
            {PROFILE_NAV_ITEMS.map((item) => (
                <SidebarNavItem
                    key={item.key}
                    item={item}
                    isActive={item.key === activeKey}
                />
            ))}
        </nav>
    );
};

export default SidebarNav;
