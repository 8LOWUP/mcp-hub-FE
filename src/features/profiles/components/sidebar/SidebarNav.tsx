"use client";

import React from "react";
import { PROFILE_NAV_ITEMS, SidebarKeyType } from "./constants";
import SidebarNavItem from "./SidebarNavItem";

type SidebarNavProps = {
    activeKey: SidebarKeyType;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ activeKey }) => {
    return (
        <nav aria-label="Profile navigation" className="space-y-2">
            {PROFILE_NAV_ITEMS.map((item) => (
                <SidebarNavItem key={item.key} item={item} isActive={item.key === activeKey} />
            ))}
        </nav>
    );
};

export default SidebarNav;
