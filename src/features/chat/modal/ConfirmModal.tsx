"use client";

import BaseModal from "./BaseModal";
import clsx from "clsx";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  isDestructive = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-foreground/70 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={clsx(
              "flex-1 px-4 py-2 rounded-lg",
              "bg-surface-2 hover:bg-surface-3",
              "text-foreground transition-colors"
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={clsx(
              "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
              isDestructive
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-accent hover:bg-accent/90 text-black"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
