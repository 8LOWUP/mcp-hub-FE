"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import HistoryList from "./HistoryList";
import { useChatStore } from "@/store/chat/chat-store";

const HistoryContainer = () => {
  const startNewChat = useChatStore((s) => s.startNewChat);
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
      <HistoryList />
      <PrimaryButton
        additionalClassName="start-0 w-full mt-4"
        onClick={startNewChatWithClose} // ✅ 새 대화 시작 + 드로어 닫기
      >
        + New Chat
      </PrimaryButton>
    </div>
  );
};

export default HistoryContainer;