"use client";

import React from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;            // 모달 제목
    children: React.ReactNode; // 모달 본문
    className?: string;        // 추가 스타일
};

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children, className }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    // ESC 키로 닫기
    React.useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* 모달 박스 */}
            <div
                className={`
          relative bg-surface-1 rounded-[20px] shadow-lg
          w-[600px] max-w-[90%] max-h-[90%] flex flex-col
          ${className ?? ""}
        `}
            >
                {/* 헤더 (제목) */}
                {title && (
                    <header className="px-6 py-4 border-b border-muted">
                        <h2 className="text-title2 text-primary">{title}</h2>
                    </header>
                )}

                {/* 본문 (children) */}
                <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;
