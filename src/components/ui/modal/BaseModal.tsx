"use client";

import React from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;           // 푸터 슬롯(버튼 세트 등)
    size?: "sm" | "md" | "lg";          // 패널 폭 프리셋
};

const WIDTH_BY_SIZE: Record<NonNullable<BaseModalProps["size"]>, string> = {
    sm: "w-[480px]",
    md: "w-[600px]",
    lg: "w-[720px]",
};

const BaseModal: React.FC<BaseModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 title,
                                                 children,
                                                 className,
                                                 footer,
                                                 size = "lg",
                                             }) => {
    const [mounted, setMounted] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const descId = React.useId();

    React.useEffect(() => setMounted(true), []);

    // ESC 닫기
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // 바디 스크롤 락 + 패널 포커스
    React.useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const id = window.setTimeout(() => panelRef.current?.focus(), 0);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.clearTimeout(id);
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            onMouseDown={handleBackdropClick}
        >
            {/* 오버레이: 공용 색상 체계 유지(반투명 검정은 유틸이 없으니 유일하게 투명도만 직접 지정) */}
            <div className="absolute inset-0 bg-black/60" />

            {/* 패널: 공용 표면/텍스트/경계 유틸 사용 */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={descId}
                tabIndex={-1}
                className={[
                    "relative bg-surface-1 text-primary rounded-[20px] shadow-lg",
                    WIDTH_BY_SIZE[size],
                    "max-w-[92vw] max-h-[88vh] flex flex-col outline-none",
                    className ?? "",
                ].join(" ")}
            >
                {/* 헤더 */}
                {title && (
                    <header className="px-6 pt-6 pb-4 border-b border-muted">
                        <h2 id={titleId} className="text-title2">
                            {title}
                        </h2>
                    </header>
                )}

                {/* 본문 */}
                <div id={descId} className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {/* 푸터(옵션) */}
                {footer && (
                    <footer className="px-6 py-5 border-t border-muted flex justify-end gap-3">
                        {footer}
                    </footer>
                )}
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;
