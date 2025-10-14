"use client";

import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useUpdateWorkspaceTitle, useDeleteWorkspace } from "@/hooks/chat/useWorkspaces";
import { useModalStore } from "@/features/chat/modal/modal-store";
import HistoryMenuModal from "@/features/chat/modal/HistoryMenuModal";
import clsx from "clsx";
import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import type { WorkspaceSummary } from "@/types/chat/chat-type";

type HistoryCardProps = {
  title: string;
  description?: string;
  workspaceId: string;
  onMenuClick?: () => void;
  isSending?: boolean;
};

const HistoryCard = memo(function HistoryCard({
  title,
  description,
  workspaceId,
  onMenuClick,
  isSending,
}: HistoryCardProps) {
  const { openWorkspace, currentWorkspaceId } = useCurrentWorkspace();
  const isSelected = currentWorkspaceId === workspaceId;

  
  const modalStore = useModalStore();
  const { openHistoryMenuModal, historyMenuModal, closeHistoryMenuModal, editTargetWorkspaceId, clearEditTitle } = modalStore;
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const updateTitleMutation = useUpdateWorkspaceTitle();
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);

  const emit = (name: string) =>
    typeof window !== "undefined" &&
    window.dispatchEvent(new CustomEvent(name));

  const handleClick = useCallback(() => {
    console.log('🖱️ HistoryCard 클릭 이벤트 발생 - isSending:', isSending, 'workspaceId:', workspaceId);
    
    // 전송 중이면 클릭 무시
    if (isSending) {
      return;
    }
    
    openWorkspace(workspaceId);

    // 모바일/태블릿이면 드로어 닫기
    if (window.innerWidth < 1024) {
      emit("chat:close-drawers");
    }
  }, [workspaceId, openWorkspace, isSending]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = {
      top: e.clientY,
      left: e.clientX,
      width: 0,
      height: 0,
    } as DOMRect as any;
    openHistoryMenuModal(workspaceId, title, rect);
  }, [workspaceId, title, openHistoryMenuModal]);


  return (
    <div className="relative w-full my-2" onContextMenu={handleContextMenu}>
      <div
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        className={clsx(
          "group w-full text-left rounded-md px-5 py-5 flex flex-col gap-3 transition-all duration-300 ease-in-out",
          "text-foreground",
          isSelected ? "bg-surface-3" : "bg-surface-2",
          isSelected && "ring-1 ring-inset ring-accent",
          isSending && !isSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        {/* 왼쪽 강조 바 */}
        <span
          aria-hidden
          className={clsx(
            "absolute left-0 top-0 h-full bg-accent rounded-l-lg",
            "transition-[width,opacity] duration-300 ease-in-out",
            isSelected ? "w-1 opacity-100" : "w-0 opacity-0"
          )}
        />
        {editing || editTargetWorkspaceId === workspaceId ? (
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() => {
              const v = titleInput.trim();
              if (v && v !== title) {
                updateTitleMutation.mutate({
                  workspaceId,
                  data: { title: v }
                });
              }
              setEditing(false);
              clearEditTitle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              } else if (e.key === "Escape") {
                setTitleInput(title);
                setEditing(false);
                clearEditTitle();
              }
            }}
            autoFocus
            className="text-sm font-bold truncate w-[170px] bg-transparent outline-none border-b border-accent/40"
          />
        ) : (
          <h3
            className="text-sm font-bold truncate w-[190px]"
            onDoubleClick={() => {
              setTitleInput(title);
              setEditing(true);
            }}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            className={clsx(
              "text-sm truncate transition-colors duration-300",
              isSelected ? "text-foreground/80" : "text-foreground/60"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* 옵션 버튼 */}
      <button
        type="button"
        ref={menuBtnRef}
        onClick={useCallback(() => {
          const rect = menuBtnRef.current?.getBoundingClientRect();
          if (rect) openHistoryMenuModal(workspaceId, title, rect);
        }, [workspaceId, title, openHistoryMenuModal])}
        aria-label="히스토리 카드 메뉴 열기"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 mb-6 rounded-full hover:bg-white/10 transition-colors"
      >
        <span className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
          <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
          <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
        </span>
      </button>

      {/* 히스토리 메뉴 모달 */}
      <HistoryMenuModal
        isOpen={historyMenuModal.isOpen && historyMenuModal.workspaceId === workspaceId}
        onClose={closeHistoryMenuModal}
        workspaceId={workspaceId}
        title={title}
        anchorRect={historyMenuModal.anchorRect as DOMRect | null}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  const titleChanged = prevProps.title !== nextProps.title;
  const descriptionChanged = prevProps.description !== nextProps.description;
  const workspaceIdChanged = prevProps.workspaceId !== nextProps.workspaceId;
  const isSendingChanged = prevProps.isSending !== nextProps.isSending;
  
  const isEqual = !titleChanged && !descriptionChanged && !workspaceIdChanged && !isSendingChanged;
  
  if (!isEqual) {
    console.log('🔄 HistoryCard props 변경됨:', {
      workspaceId: nextProps.workspaceId,
      title: nextProps.title.substring(0, 20),
      changes: {
        title: titleChanged,
        description: descriptionChanged,
        workspaceId: workspaceIdChanged,
        isSending: isSendingChanged
      }
    });
  }
  
  return isEqual;
});

export default HistoryCard;