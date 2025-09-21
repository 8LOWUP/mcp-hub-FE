// src/app/[locale]/profiles/layout.tsx
import React from "react";
import { THEME_CLASSES, LAYOUT_TOKENS } from "@/features/profiles/constants";
import SidebarClient from "@/features/profiles/components/sidebar/SidebarClient";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    const style = { ["--header-h" as any]: `${LAYOUT_TOKENS.HEADER_HEIGHT_PX}px` };

    return (
        <div style={style} className={`flex flex-1 min-h-0 ${THEME_CLASSES.PAGE_BG} text-primary`}>
            {/* ⬇ 바깥 컬럼은 'stretch' 되게 두고 border는 여기 둠 (높이 고정 X) */}
            <aside className="hidden md:flex w-[280px] shrink-0 border-r border-contrast">
                {/* ⬇ sticky/scroll을 안쪽에만 적용 */}
                <div className="sticky top-[var(--header-h)] max-h-[calc(100vh-var(--header-h))] overflow-auto w-full">
                    <SidebarClient />
                </div>
            </aside>

            {/* 오른쪽 컨텐츠 */}
            <section className="flex-1 min-h-0">
                <div className="h-full overflow-auto px-6 pb-24 pt-[var(--header-h)]">
                    {children}
                </div>
            </section>
        </div>
    );
}
