"use client";

import { useChatStore } from "@/store/chat/chat-store";
import clsx from "clsx";

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

  return (
    <div className="relative w-full my-2">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={selected}
        className={clsx(
          "group w-full text-left rounded-lg p-5 transition-all duration-300 ease-in-out",
          "text-foreground",
          "bg-surface-2 hover:bg-surface-2",
          selected && "ring-1 ring-inset ring-accent bg-surface-3"
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

        <h3 className="text-sm font-bold truncate">{title}</h3>
        {description && (
          <p
            className={clsx(
              "mt-2 text-xs truncate transition-colors duration-300",
              selected ? "text-foreground/80" : "text-foreground/60"
            )}
          >
            {description}
          </p>
        )}
      </button>

      {/* 옵션 버튼 */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="히스토리 카드 메뉴 열기"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <span className="flex flex-col gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
        </span>
      </button>
    </div>
  );
}