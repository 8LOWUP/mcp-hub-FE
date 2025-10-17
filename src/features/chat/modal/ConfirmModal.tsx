"use client";

import { useTranslations } from "next-intl";
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
  confirmText,
  cancelText,
  isDestructive = false,
}: ConfirmModalProps) {
  // Locale translations
  const t = useTranslations('ChatPage');
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-black rounded-3xl">
        <div className="p-2 pt-0 mb-3">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-foreground/70 whitespace-pre-line">{message}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={clsx(
              "flex-1 px-4 py-2 rounded-lg",
              "bg-surface-2 hover:bg-surface-3",
              "text-foreground transition-colors"
            )}
          >
            {cancelText || t('cancel')}
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
            {confirmText || t('confirm')}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
