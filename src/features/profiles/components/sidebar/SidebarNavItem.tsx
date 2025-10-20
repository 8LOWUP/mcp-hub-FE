// src/features/profiles/components/sidebar/SidebarNavItem.tsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { SidebarItem } from "./constants";

type SidebarNavItemProps = {
    item: SidebarItem;   // ⬅️ 이름 통일
    isActive?: boolean;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
    // Locale translations
    const t = useTranslations('ProfilePage');
    const router = useRouter();
    const pathname = usePathname();
    const { icon: Icon, label, href, key } = item;

    const handleClick = () => {
        router.push(href);
    };

    return (
        <div aria-current={isActive ? "page" : undefined}>
            <PrimaryButton
                size="sm"
                onClick={handleClick}
                additionalClassName={[
                    "w-full justify-start gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActive
                        ? "!bg-[var(--sb-nav-btn-bg-hover)] text-toggle-2"
                        : "!bg-[var(--sb-nav-btn-bg)] hover:!bg-[var(--sb-nav-btn-bg-hover)] text-secondary",
                ].join(" ")}
            >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate">{t(label)}</span>
            </PrimaryButton>
        </div>
    );
};

export default SidebarNavItem;
