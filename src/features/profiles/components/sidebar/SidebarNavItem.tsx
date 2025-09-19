"use client";

import React from "react";
import Link from "next/link";
import { SidebarItemType } from "./constants";

type SidebarNavItemProps = {
    item: SidebarItemType;
    isActive?: boolean;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
    const { icon: Icon, label, href } = item;

    return (
        <Link
            href={href}
            className={[
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors outline-none",
                isActive
                    ? "bg-surface-2 text-white"
                    : "text-secondary hover:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-accent",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
        >
            <Icon className="w-5 h-5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
        </Link>
    );
};

export default SidebarNavItem;
