// src/app/[locale]/profiles/layout.tsx
import React from "react";
import { THEME_CLASSES, LAYOUT_TOKENS } from "@/features/profiles/constants";
import SidebarClient from "@/features/profiles/components/sidebar/SidebarClient";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    const style: Record<string, string> = {
        "--header-h": `${LAYOUT_TOKENS.HEADER_HEIGHT_PX}px`,
    };


    return (
        <div style={style} className={`${THEME_CLASSES.PAGE_BG} text-primary min-h-screen pt-[var(--header-h)]`}>
            <div className="flex h-[calc(100vh-var(--header-h))] border-t border-contrast">
                {/* 사이드바 */}
                <aside className="hidden md:flex w-[280px] shrink-0 border-r border-contrast h-full">
                    <div className="sticky top-0 h-full overflow-auto w-full">
                        <SidebarClient />
                    </div>
                </aside>

                {/* 오른쪽 내용 */}
                <main className="flex-1 h-full overflow-y-auto">
                    <div className="min-h-full px-6 pb-24 pt-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
