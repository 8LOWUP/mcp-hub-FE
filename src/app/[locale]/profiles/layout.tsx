// app/[locale]/profiles/layout.tsx
import React from "react";
import ProfileSidebarPlaceholder from "@/features/profiles/components/ProfileSidebarPlaceholder";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-surface-1 text-primary flex">
            {/*추후 공통 사이드바로 변경 ㄱㄱ*/}
            <aside className="hidden md:block w-[240px] border-r border-contrast">
                <ProfileSidebarPlaceholder />
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}
