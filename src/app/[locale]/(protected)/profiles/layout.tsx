// src/app/[locale]/profiles/layout.tsx
"use client";

import React from "react";
import { THEME_CLASSES, LAYOUT_TOKENS } from "@/features/profiles/constants";
import SidebarClient from "@/features/profiles/components/sidebar/SidebarClient";
import SidebarDrawer from "@/features/_shared/components/sidebar/SidebarDrawer";
import SidebarToggleButton from "@/features/_shared/components/sidebar/SidebarToggleButton";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


    const style: React.CSSProperties & Record<string, string> = {
        "--header-h": `${LAYOUT_TOKENS.HEADER_HEIGHT_PX}px`,
    };


    const handleOpen = () => setIsSidebarOpen(true);
    const handleClose = () => setIsSidebarOpen(false);

    return (
        <div
            style={style}
            className={`${THEME_CLASSES.PAGE_BG} text-primary min-h-screen pt-[var(--header-h)]`}
        >
            {/* 모바일 상단: 드로어 토글 바 (md 미만에서만 노출) */}
            <div className="md:hidden sticky top-[var(--header-h)] z-30 border-b border-contrast bg-surface-1/80 backdrop-blur px-4 py-2 flex items-center">
                <SidebarToggleButton isOpen={isSidebarOpen} onClick={handleOpen} />
                <h2 className="ml-2 text-title3">Profiles</h2>
            </div>

            <div className="flex h-[calc(100vh-var(--header-h))] border-t border-contrast">
                {/* 데스크톱 사이드바: md 이상에서 고정 노출 */}
                <aside className="hidden md:flex w-60 shrink-0 border-r border-contrast h-full">
                    {/* 헤더 아래에 딱 붙도록 sticky 기준을 헤더 높이에 맞춤 */}
                    <div className="sticky top-[var(--header-h)] h-[calc(100vh-var(--header-h))] overflow-auto w-full">
                        <SidebarClient />
                    </div>
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="flex-1 h-full overflow-y-auto">
                    <div className="min-h-full px-6 pb-24 pt-6">{children}</div>
                </main>
            </div>

            {/*  모바일 드로어: md 미만에서만 의미 있음 (컴포넌트 내부에서 md:hidden 처리해도 OK) */}
            <SidebarDrawer isOpen={isSidebarOpen} onClose={handleClose}>
                <SidebarClient />
            </SidebarDrawer>
        </div>
    );
}
