// src/features/profiles/components/sidebar/SidebarNav.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PROFILE_NAV_ITEMS, SidebarKeyType, SidebarItem } from "./constants";
import SidebarNavItem from "./SidebarNavItem";

type SidebarNavProps = { activeKey: SidebarKeyType };

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

    return (
        <nav
            aria-label="Profile navigation"
            className="space-y-3"
            style={
                {
                    ["--sb-nav-btn-bg" as any]: "var(--bg-color-1)",
                    ["--sb-nav-btn-bg-hover" as any]: "var(--bg-color-3)",
                } as React.CSSProperties
            }
        >
            {items.map((item) => (
                <SidebarNavItem key={item.key} item={item} isActive={item.key === activeKey} />
            ))}
        </nav>
    );
};

export default SidebarNav;
