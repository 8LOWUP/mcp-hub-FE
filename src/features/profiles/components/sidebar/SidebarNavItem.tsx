// src/features/profiles/components/sidebar/SidebarNavItem.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { SidebarItem } from "./constants";

type SidebarNavItemProps = {
    item: SidebarItem;   // ⬅️ 이름 통일
    isActive?: boolean;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
    const router = useRouter();
    const { icon: Icon, label, href } = item;

    return (
        <div aria-current={isActive ? "page" : undefined}>
            <PrimaryButton
                size="sm"
                onClick={() => router.push(href)}
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
