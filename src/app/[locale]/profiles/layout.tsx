import React from "react";
import { ProfileSidebar } from "@/features/profiles/components/sidebar";
import { THEME_CLASSES } from "@/features/profiles/constants";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`min-h-screen ${THEME_CLASSES.PAGE_BG} text-primary flex`}>
            <aside className="hidden md:block w-[280px] border-r border-contrast">
                <ProfileSidebar activeKey="stored" username="KIKI" />
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}
