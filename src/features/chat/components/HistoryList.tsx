"use client";

import { useWorkspaces } from "@/hooks/chat/useWorkspaces";
import HistoryCard from "./HistoryCard";
import { memo } from "react";
import { useTranslations } from "next-intl";
import type { WorkspaceSummary } from "@/types/chat/chat-type";

const HistoryList = memo(function HistoryList({ isSending = false }: { isSending?: boolean }) {
  // Locale translations
  const t = useTranslations('ChatPage');
  const { data: workspaces = [], isLoading: loadingList, error } = useWorkspaces() as { data: WorkspaceSummary[], isLoading: boolean, error: any };

  return (
    <>
      <h2 className="text-2xl font-bold">{t('history')}</h2>
      <div className="px-3 pb-2">
        {loadingList && (
          <div className="text-sm text-foreground/60 py-2">{t('loading')}</div>
        )}
        {error && (
          <div className="text-sm text-red-500 py-2">
            {t('workspaceError')}
          </div>
        )}
        {!loadingList && !error && workspaces.length === 0 && (
          <div className="text-sm text-foreground/60 py-2" dangerouslySetInnerHTML={{ __html: t('noConversations') }} />
        )}
      </div>

      <ul className="flex flex-col w-full h-full overflow-y-auto">
        {workspaces.map((w) => {
          const description = formatTime(w.createdAt);
          
          return (
            <li key={w.workspaceId}>
              <HistoryCard
                title={w.title}
                description={description}
                workspaceId={w.workspaceId}
                isSending={isSending}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
});

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

export default HistoryList;