// src/components/ui/SecondaryButton.tsx
"use client";

import clsx from "clsx";
import * as React from "react";

type NativeBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface SecondaryButtonProps extends NativeBtnProps {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    hoverOnly?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
                                                             children,
                                                             className,
                                                             variant = "primary",
                                                             size = "md",
                                                             disabled = false,
                                                             hoverOnly = false,
                                                             type = "button",             // ✅ 기본 버튼 타입 보장
                                                             onClick,
                                                             ...rest                      // ✅ 나머지 네이티브 props 그대로 전달
                                                         }) => {
    const variants = {
        primary: "bg-accent hover:bg-accent-hover text-black",
        secondary: hoverOnly
            ? "bg-surface-2 text-primary hover:bg-accent hover:text-black focus:outline-none focus:ring-0 active:bg-surface-2"
            : "bg-surface-2 text-primary hover:bg-accent hover:text-black",
    };

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log("[SecondaryButton] click"); // ← 필요시 켜서 확인
        onClick?.(e);
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={clsx(
                "flex items-center justify-center rounded-3xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variant === "primary" ? variants.primary : variants.secondary,
                sizes[size],
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
