import React from "react";
import ProfileSidebarPlaceholder from "@/features/profiles/components/ProfileSidebarPlaceholder";
import { THEME_CLASSES } from "@/features/profiles/constants"; // constants에서 PAGE_BG 불러오기

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`min-h-screen ${THEME_CLASSES.PAGE_BG} text-primary flex`}>
            {/* 추후 공통 사이드바로 변경 예정 */}
            <aside className="hidden md:block w-[240px] border-r border-contrast">
                <ProfileSidebarPlaceholder />
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}
