// app/[locale]/market/layout.tsx
"use client";

import React from "react";
import { THEME_CLASSES, LAYOUT_TOKENS } from "@/features/_shared/constants/theme";
import SidebarClient from "@/features/market/components/sidebar/SidebarClient";

import SidebarDrawer from "@/features/_shared/components/sidebar/SidebarDrawer";
import SidebarToggleButton from "@/features/_shared/components/sidebar/SidebarToggleButton";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const style: React.CSSProperties & Record<string, string> = {
        "--header-h": `${LAYOUT_TOKENS.HEADER_HEIGHT_PX}px`,
    };

    const handleOpen = () => setIsSidebarOpen(true);
    const handleClose = () => setIsSidebarOpen(false);

    return (
        <div
            style={style}
            className={`${THEME_CLASSES.PAGE_BG} ${THEME_CLASSES.TEXT_PRIMARY} min-h-screen pt-[var(--header-h)]`}
        >
            {/* ====== 헤더 영역 ====== */}
            <header
                className="h-[var(--header-h)] px-4 border-b border-contrast flex items-center justify-between md:hidden"
            >
                <SidebarToggleButton isOpen={isSidebarOpen} onClick={handleOpen} />
            </header>

            {/* ====== 본문 영역 ====== */}
            <div className={`flex h-[calc(100vh-var(--header-h))] border-t ${THEME_CLASSES.BORDER_CONTRAST}`}>
                {/* 사이드바 (md 이상 고정) */}
                <aside
                    className={`hidden md:flex w-60 shrink-0 border-r ${THEME_CLASSES.BORDER_CONTRAST} h-full`}
                >
                    <div className="sticky top-0 h-full overflow-auto w-full">
                        <SidebarClient />
                    </div>
                </aside>

                {/* 컨텐츠 */}
                <main className="flex-1 h-full overflow-y-auto">
                    <div className="min-h-full px-6 pb-24 pt-6">{children}</div>
                </main>
            </div>

            {/* 모바일 드로어 */}
            <SidebarDrawer isOpen={isSidebarOpen} onClose={handleClose}>
                <SidebarClient onItemClick={handleClose} />
            </SidebarDrawer>
        </div>
    );
}
