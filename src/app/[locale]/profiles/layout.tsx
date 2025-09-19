import React from "react";
import { THEME_CLASSES } from "@/features/profiles/constants";
import SidebarClient from "@/features/profiles/components/sidebar/SidebarClient";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`min-h-screen ${THEME_CLASSES.PAGE_BG} text-primary flex`}>
            <aside className="hidden md:block w-[280px] border-r border-contrast">
                <SidebarClient />
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}
