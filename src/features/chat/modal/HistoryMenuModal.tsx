"use client";

import { useChatStore } from "@/store/chat/chat-store";
import { useModalStore } from "./modal-store";
import BaseModal from "./BaseModal";
import ConfirmModal from "./ConfirmModal";
import clsx from "clsx";
import { useState, useEffect } from "react";

type HistoryMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  title: string;
  anchorRect?: DOMRect | null;
};

export default function HistoryMenuModal({
  isOpen,
  onClose,
  workspaceId,
  title,
  anchorRect,
}: HistoryMenuModalProps) {
  const deleteWorkspace = useChatStore((s) => s.deleteWorkspace);
  const renameWorkspace = useChatStore((s) => s.renameWorkspace);
  const startEditTitle = useModalStore((s) => s.startEditTitle);
  const { openConfirmModal, confirmModal, closeConfirmModal } = useModalStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleDelete = () => {
    openConfirmModal({
      title: "대화 삭제",
      message: `"${title}" 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      isDestructive: true,
      onConfirm: () => {
        deleteWorkspace(workspaceId);
        onClose();
      },
    });
  };

  const handleRename = () => {
    startEditTitle(workspaceId);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} anchorRect={anchorRect ?? null} overlayClassName="top-7 -left-34" placement="bottom">
      <div className={clsx(
        "h-full rounded-sm bg-surface-3 shadow-2xs border border-zinc-400",
        isSmallScreen ? "w-full px-6 py-4" : "w-fit"
      )}>
        <div className={clsx("flex flex-col", isSmallScreen ? "w-full" : "w-fit")}>
          <button
            onClick={handleRename}
            className={clsx(
              "w-full text-left bg-surface-3 rounded-t-sm",
              "hover:bg-surface-4",
              isSmallScreen ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"
            )}
          >
            워크스페이스 제목 수정하기
          </button>
          <button
            onClick={handleDelete}
            className={clsx(
              "w-full text-left bg-surface-3 rounded-b-sm",
              "hover:bg-red-500/10 text-red-400",
              isSmallScreen ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"
            )}
          >
            워크스페이스 삭제하기
          </button>
        </div>
      </div>
      
      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm || (() => {})}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        isDestructive={confirmModal.isDestructive}
      />
    </BaseModal>
  );
}
