import PrimaryButton from "@/components/ui/PrimaryButton";
import HistoryList from "./HistoryList";
import { useChatStore } from "@/store/chat/chat-store";

const HistoryContainer = () => {
  const startNewChat = useChatStore((s) => s.startNewChat);
  // TODO 고치기

  const startNewChatWithClose = {

  }

  return (
    <div className="w-70 flex flex-col justify-between h-full p-4 pt-0">
      <HistoryList />
      <PrimaryButton
        additionalClassName="start-0 w-full mt-4"
        onClick={startNewChat} // ✅ 새 대화 시작
      >
        + New Chat
      </PrimaryButton>
    </div>
  );
};

export default HistoryContainer;