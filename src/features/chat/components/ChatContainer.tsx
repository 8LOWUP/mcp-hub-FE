"use client";

import ChattingInputContainer from "./ChattingInputContainer";
import type { ModelInfo } from "@/hooks/chat/useModelManager";

type ChatContainerProps = {
  onSend?: (text: string, modelId?: string) => void;
  isSending?: boolean;
  availableModels: ModelInfo[];
  selectedModel: ModelInfo | null;
  modelsLoading: boolean;
  selectModel: (modelId: string) => void;
};

export default function ChatContainer({
  onSend,
  isSending = false,
  availableModels,
  selectedModel,
  modelsLoading,
  selectModel,
}: ChatContainerProps) {
  
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
