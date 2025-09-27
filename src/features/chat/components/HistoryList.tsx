"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat/chat-store";
import HistoryCard from "./HistoryCard";

export default function HistoryList() {
  const workspaces = useChatStore((s) => s.workspaces);
  const loadingList = useChatStore((s) => s.loadingList);
  const loadWorkspaceList = useChatStore((s) => s.loadWorkspaceList);

  useEffect(() => {
    if (!workspaces || workspaces.length === 0) {
      loadWorkspaceList();
    }
  }, [loadWorkspaceList, workspaces.length]);

  return (
    <>
      <h2 className="text-2xl font-bold">History</h2>
      <div className="px-3 pb-2">
        {loadingList && (
          <div className="text-sm text-foreground/60 py-2">불러오는 중…</div>
        )}
        {!loadingList && workspaces.length === 0 && (
          <div className="text-sm text-foreground/60 py-2">
            아직 대화가 없어요. <span className="underline">New Chat</span>을 눌러 시작해보세요!
          </div>
        )}
      </div>

      <ul className="flex flex-col w-full h-full overflow-y-auto">
        {workspaces.map((w) => (
          <li key={w.workspaceId}>
            <HistoryCard
              title={w.title}
              description={formatTime(w.createdAt)}
              workspaceId={w.workspaceId}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    const hh = `${d.getHours()}`.padStart(2, "0");
    const mi = `${d.getMinutes()}`.padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return iso;
  }
}