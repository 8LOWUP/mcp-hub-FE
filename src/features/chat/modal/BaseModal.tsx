"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  // anchored positioning
  anchorRect?: { top: number; left: number; width: number; height: number } | null;
  placement?: "right" | "top" | "bottom"; // default center if not provided
};

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  anchorRect,
  placement,
}: BaseModalProps) {
  const portalRoot = useRef<HTMLElement | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    portalRoot.current = document.getElementById("chat-portal-root");
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !portalRoot.current) return null;

  const centered = !anchorRect || !placement || isSmallScreen;

  const anchoredStyle: React.CSSProperties | undefined = centered
    ? undefined
    : placement === "right"
    ? {
        position: "absolute",
        top: anchorRect.top + window.scrollY,
        left: anchorRect.left + anchorRect.width + 8 + window.scrollX,
      }
    : placement === "bottom"
    ? {
        position: "absolute",
        top: anchorRect.top + anchorRect.height + 8 + window.scrollY,
        left: anchorRect.left + window.scrollX,
      }
    : {
        position: "absolute",
        top: anchorRect.top - 8 + window.scrollY,
        left: anchorRect.left + window.scrollX,
        transform: "translateY(-100%)",
      };

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-50",
        centered ? "flex items-center justify-center" : "",
        "duration-200",
        overlayClassName
      )}
      onClick={onClose}
    >
      {/* backdrop only when centered */}
      {centered && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}
      <div
        className={clsx(
          "relative flex justify-center",
          centered ? "w-full max-w-md mx-4" : "w-fit",
          "transform transition-all duration-200",
          className
        )}
        style={anchoredStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalRoot.current
  );
}
