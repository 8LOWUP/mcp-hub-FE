"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PROFILE_NAV_ITEMS, SidebarKeyType, SidebarItem } from "./constants";
import SidebarNavItem from "./SidebarNavItem";

type SidebarNavProps = { activeKey: SidebarKeyType };

// ✅ CSS 변수 타입을 로컬에서 선언
type NavCSSVars = {
    "--sb-nav-btn-bg"?: string;
    "--sb-nav-btn-bg-hover"?: string;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ activeKey }) => {
    const { locale } = useParams<{ locale?: string }>();

    const items: SidebarItem[] = React.useMemo(
        () =>
            PROFILE_NAV_ITEMS.map((it) => ({
                ...it,
                href: locale ? `/${locale}${it.href}` : it.href,
            })),
        [locale]
    );

    // ✅ any/as 캐스팅 없이 안전하게 style 작성
    const navStyle: React.CSSProperties & NavCSSVars = {
        "--sb-nav-btn-bg": "var(--bg-color-1)",
        "--sb-nav-btn-bg-hover": "var(--bg-color-3)",
    };

    return (
        <nav aria-label="Profile navigation" className="space-y-3" style={navStyle}>
            {items.map((item) => (
                <SidebarNavItem key={item.key} item={item} isActive={item.key === activeKey} />
            ))}
        </nav>
    );
};

export default SidebarNav;
