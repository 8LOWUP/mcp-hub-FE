// components/ModalExample.tsx
"use client";
import { useEffect, useRef } from "react";
import Portal from "../Portal";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function ModalExample({ open, onClose, title = "Dialog", children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ✅ 모든 Hook은 조건부 return보다 위에 둔다
  useEffect(() => {
    if (!open) return;

    // 포커스 이동
    dialogRef.current?.focus();

    // ESC 닫기
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    // 바디 스크롤 락
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // cleanup
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null; // ✅ Hook 선언 이후에 조건부 return

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        onMouseDown={onBackdrop}
        aria-hidden="true"
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="w-full max-w-md rounded-2xl bg-surface-2 dark:bg-[#2C2C2C] shadow-xl outline-none"
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </Portal>
  );
}