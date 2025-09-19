// src/app/[locale]/profiles/layout.tsx
import React from "react";
import { THEME_CLASSES } from "@/features/profiles/constants";
import SidebarClient from "@/features/profiles/components/sidebar/SidebarClient";

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
    return (
        // 헤더 아래 영역을 꽉 채우기 (헤더 높이 80px 가정)
        <div className={`flex ${THEME_CLASSES.PAGE_BG} text-primary h-[calc(100vh-80px)] min-h-0`}>
            {/* 고정 사이드바 */}
            <aside
                className="
          hidden md:block w-[280px] border-r border-contrast
          sticky top-[80px] self-start
          h-[calc(100vh-80px)] overflow-hidden
        "
            >
                <SidebarClient />
            </aside>

            {/* 오른쪽 컨텐츠만 세로 스크롤 */}
            <main className="flex-1 min-h-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
