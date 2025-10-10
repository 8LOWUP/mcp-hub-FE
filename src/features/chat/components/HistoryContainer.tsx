"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import HistoryList from "./HistoryList";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";

const HistoryContainer = () => {
  const { startNewChat, isSending } = useCurrentWorkspace();
  const emit = (name: string) =>
    typeof window !== "undefined" &&
    window.dispatchEvent(new CustomEvent(name));

  const startNewChatWithClose = () => {
    startNewChat();
    // 모바일/태블릿이면 드로어 닫기
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      emit("chat:close-drawers");
    }
  };

  return (
    <div className="w-70 flex flex-col justify-between h-full p-4 pt-0">
      <HistoryList isSending={isSending} />
      <PrimaryButton
        additionalClassName="start-0 w-full mt-4"
        onClick={startNewChatWithClose}
      >
        + New Chat
      </PrimaryButton>
    </div>
  );
};

export default HistoryContainer;