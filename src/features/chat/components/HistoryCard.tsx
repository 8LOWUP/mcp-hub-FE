"use client";

import { useChatStore } from "@/store/chat/chat-store";
import { useModalStore } from "@/features/chat/modal/modal-store";
import HistoryMenuModal from "@/features/chat/modal/HistoryMenuModal";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type HistoryCardProps = {
  title: string;
  description?: string;
  workspaceId: string;
  onMenuClick?: () => void;
};

export default function HistoryCard({
  title,
  description,
  workspaceId,
  onMenuClick,
}: HistoryCardProps) {
  const currentWorkspaceId = useChatStore((s) => s.currentWorkspaceId);
  const openWorkspace = useChatStore((s) => s.openWorkspace);
  const startNewChat = useChatStore((s) => s.startNewChat);
  const selected = currentWorkspaceId === workspaceId;
  
  const { openHistoryMenuModal, historyMenuModal, closeHistoryMenuModal, editTargetWorkspaceId, clearEditTitle } = useModalStore();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const renameWorkspace = useChatStore((s) => s.renameWorkspace);
  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);

  const emit = (name: string) =>
    typeof window !== "undefined" &&
    window.dispatchEvent(new CustomEvent(name));

  const handleClick = () => {
    openWorkspace(workspaceId);

    // 모바일/태블릿이면 드로어 닫기
    if (window.innerWidth < 1024) {
      emit("chat:close-drawers");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = {
      top: e.clientY,
      left: e.clientX,
      width: 0,
      height: 0,
    } as DOMRect as any;
    openHistoryMenuModal(workspaceId, title, rect);
  };


  return (
    <div className="relative w-full my-2" onContextMenu={handleContextMenu}>
      <div
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-pressed={selected}
        className={clsx(
          "group w-full text-left rounded-lg px-5 py-5 flex flex-col gap-3 transition-all duration-300 ease-in-out cursor-pointer",
          "text-foreground",
          selected ? "bg-surface-3" : "bg-surface-2",
          selected && "ring-1 ring-inset ring-accent"
        )}
      >
        {/* 왼쪽 강조 바 */}
        <span
          aria-hidden
          className={clsx(
            "absolute left-0 top-0 h-full bg-accent rounded-l-lg",
            "transition-[width,opacity] duration-300 ease-in-out",
            selected ? "w-1 opacity-100" : "w-0 opacity-0"
          )}
        />
        {editing || editTargetWorkspaceId === workspaceId ? (
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() => {
              const v = titleInput.trim();
              if (v && v !== title) renameWorkspace(workspaceId, v);
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
              selected ? "text-foreground/80" : "text-foreground/60"
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
        onClick={() => {
          const rect = menuBtnRef.current?.getBoundingClientRect();
          if (rect) openHistoryMenuModal(workspaceId, title, rect);
        }}
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
}