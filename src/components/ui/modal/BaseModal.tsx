"use client";

import React, { PropsWithChildren, useEffect } from "react";
import clsx from "clsx";

type BaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
};

const BaseModal: React.FC<PropsWithChildren<BaseModalProps>> = ({
                                                                    isOpen,
                                                                    onClose,
                                                                    className,
                                                                    children,
                                                                }) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
            aria-modal
            role="dialog"
        >
            <div
                className={clsx("rounded-[28px] shadow-lg", className)}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
