"use client";

import { useModalStore } from "./modal-store";
import { useDeleteWorkspace } from "@/hooks/chat/useWorkspaces";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useQueryClient } from '@tanstack/react-query';
import BaseModal from "./BaseModal";
import ConfirmModal from "./ConfirmModal";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

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
  // Locale translations
  const t = useTranslations('ChatPage');
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const { currentWorkspaceId, openWorkspace } = useCurrentWorkspace();
  const startEditTitle = useModalStore((s) => s.startEditTitle);
  const queryClient = useQueryClient();
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
      title: t('deleteConversation'),
      message: t('deleteConversationConfirm', { title }),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      isDestructive: true,
      onConfirm: () => {
        
        // 임시 워크스페이스인지 확인
        const isTemporary = workspaceId.startsWith('new-');
        
        if (isTemporary) {
          // 임시 워크스페이스는 React Query 캐시에서 제거
          
          // React Query 캐시에서 임시 워크스페이스 제거
          queryClient.setQueryData(['workspaces'], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              result: (oldData.result || []).filter((w: any) => w.workspaceId !== workspaceId)
            };
          });
          
          // 현재 선택된 워크스페이스가 삭제된 워크스페이스라면
          if (currentWorkspaceId === workspaceId) {
            openWorkspace('new-temp');
          }
          
          onClose();
        } else {
          // 실제 워크스페이스는 서버에서 삭제
          deleteWorkspaceMutation.mutate(workspaceId, {
            onSuccess: () => {
              // 현재 선택된 워크스페이스가 삭제된 워크스페이스라면
              if (currentWorkspaceId === workspaceId) {
                openWorkspace('new-temp');
              }
              
              onClose();
            },
            onError: (error) => {
              console.error('워크스페이스 삭제 실패:', error);
              // 에러 발생 시 모달은 닫지 않음
            }
          });
        }
      },
    });
  };

  const handleRename = () => {
    startEditTitle(workspaceId);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} anchorRect={anchorRect ?? null} overlayClassName="" placement="bottom">
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
            {t('editWorkspaceTitle')}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteWorkspaceMutation.isPending}
            className={clsx(
              "w-full text-left bg-surface-3 rounded-b-sm",
              "hover:bg-red-500/10 text-red-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSmallScreen ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"
            )}
          >
            {deleteWorkspaceMutation.isPending ? t('deleting') : t('deleteWorkspace')}
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
