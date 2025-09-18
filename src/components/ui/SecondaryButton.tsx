// src/components/ui/SecondaryButton.tsx
"use client";

import clsx from "clsx";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  /** ✅ 클릭/포커스 시 색 변경 없이, hover에만 반응 */
  hoverOnly?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
                                                           children,
                                                           onClick,
                                                           variant = "primary",
                                                           size = "md",
                                                           className,
                                                           disabled = false,
                                                           hoverOnly = false,
                                                         }) => {
  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-black",
    // 공통 토큰만 사용. 상태 색상은 hover에서만 바뀌도록.
    secondary: hoverOnly
        ? "bg-surface-2 text-primary hover:bg-accent hover:text-black focus:outline-none focus:ring-0 active:bg-surface-2"
        : "bg-surface-2 text-primary hover:bg-accent hover:text-black",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
      <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(
              "flex items-center justify-center rounded-3xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "primary" ? variants.primary : variants.secondary,
              sizes[size],
              className
          )}
      >
        {children}
      </button>
  );
};

export default SecondaryButton;
