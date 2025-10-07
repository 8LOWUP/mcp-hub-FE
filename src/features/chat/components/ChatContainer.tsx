"use client";

import { useModelManager } from "@/hooks/chat/useModelManager";
import ChattingInputContainer from "./ChattingInputContainer";

export default function ChatContainer({
  onSend,
  isSending = false,
}: {
  onSend?: (text: string, modelId?: string) => void;
  isSending?: boolean;
}) {
  // 🔹 상위에서 한 번만 실행
  const { availableModels, selectedModel, isLoading: modelsLoading, selectModel } = useModelManager();
  
  return (
    <ChattingInputContainer 
      onSend={onSend}
      isSending={isSending}
      availableModels={availableModels}
      selectedModel={selectedModel}
      modelsLoading={modelsLoading}
      selectModel={selectModel}
    />
  );
}
