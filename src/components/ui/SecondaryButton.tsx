"use client"

import { useState } from "react";
import clsx from "clsx";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(false);

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-black", // ✅ primary는 항상 유지
    secondary: {
      default: "bg-surface-2 hover:bg-accent hover:text-black text-white",
      selected: "bg-accent text-black hover:bg-accent/10",
    },
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getVariantClass = () => {
    if (variant === "primary") return variants.primary;
    if (variant === "secondary") {
      return selected ? variants.secondary.selected : variants.secondary.default;
    }
  };

  return (
    <button
      onClick={() => {
        if (variant === "secondary") {
          setSelected(!selected); // ✅ secondary일 때만 토글
        }
        onClick?.();
      }}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center rounded-3xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        getVariantClass(),
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;