// src/features/profiles/components/sidebar/SidebarNavItem.tsx
"use client";

import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { SidebarItemType } from "./constants";

type SidebarNavItemProps = {
    item: SidebarItemType;
    isActive?: boolean;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
    const { icon: Icon, label } = item;

    return (
        <div aria-current={isActive ? "page" : undefined}>
            <PrimaryButton
                size="sm"
                // ⬇︎ 네브 영역에서만 정의된 변수로 색상을 강제 오버라이드
                className={[
                    "w-full justify-start gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActive
                        ? "!bg-[var(--sb-nav-btn-bg-hover)] text-white"
                        : "!bg-[var(--sb-nav-btn-bg)] hover:!bg-[var(--sb-nav-btn-bg-hover)] text-secondary",
                ].join(" ")}
            >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate">{label}</span>
            </PrimaryButton>
        </div>
    );
};

export default SidebarNavItem;
