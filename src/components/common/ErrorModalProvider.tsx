"use client";

import React from "react";
import { useTokenErrorStore } from "@/store/error/error-store";
import TokenErrorModal from "@/components/modal/TokenErrorModal";
import LLMSettingsModal from "@/components/modal/LLMSettingsModal";

const ErrorModalProvider: React.FC = () => {
  const { 
    isTokenErrorModalOpen, 
    closeTokenErrorModal, 
    retryCallback,
    isLLMSettingsModalOpen,
    closeLLMSettingsModal,
    selectedLLMId
  } = useTokenErrorStore();



  const handleRetry = () => {
    if (retryCallback) {
      retryCallback();
    }
    closeTokenErrorModal();
  };

  const handleGoToSettings = () => {
    closeTokenErrorModal();
    // LLM 설정 모달 열기
    const { openLLMSettingsModal } = useTokenErrorStore.getState();
    openLLMSettingsModal(selectedLLMId);
  };

  return (
    <>
      <TokenErrorModal
        isOpen={isTokenErrorModalOpen}
        onClose={closeTokenErrorModal}
        onRetry={retryCallback ? handleRetry : undefined}
        onGoToSettings={handleGoToSettings}
      />
      <LLMSettingsModal
        isOpen={isLLMSettingsModalOpen}
        onClose={closeLLMSettingsModal}
        selectedLLMId={selectedLLMId}
      />
    </>
  );
};

export default ErrorModalProvider;
