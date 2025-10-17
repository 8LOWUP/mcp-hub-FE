"use client";

import React from "react";
import { createPortal } from "react-dom";

type SidebarDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isOpen, onClose, children }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    // ESC로 닫기
    React.useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            aria-hidden={!isOpen}
            className={[
                "md:hidden fixed inset-0 z-[1000]",
                isOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
        >
            {/* 오버레이 */}
            <div
                onClick={onClose}
                className={[
                    "absolute inset-0 transition-opacity",
                    isOpen ? "opacity-100 bg-black/40" : "opacity-0",
                ].join(" ")}
            />

            {/* 드로어 패널 (좌측 슬라이드 인) */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Sidebar"
                className={[
                    "absolute left-0 top-0 h-full w-[50%] max-w-[280px] bg-surface-1 border-r border-contrast",
                    "transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "shadow-xl",
                ].join(" ")}
            >
                <div className="h-full overflow-y-auto">
                    {/* 닫기 버튼 영역(모바일 전용) */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-contrast">
                        <span className="text-title3">Menu</span>
                        <button
                            onClick={onClose}
                            className="rounded-lg px-3 py-1 border border-contrast hover:bg-surface-2 text-body3"
                            aria-label="Close sidebar"
                        >
                            Close
                        </button>
                    </div>

                    <div className="p-2">{children}</div>
                </div>
            </aside>
        </div>,
        document.body
    );
};

export default SidebarDrawer;
