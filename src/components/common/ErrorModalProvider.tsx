"use client";

import React, { useEffect } from "react";
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

  // 디버깅: Provider에서 전달/보관 중인 값 확인
  useEffect(() => {
    console.log("[ErrorModalProvider] state:", {
      isTokenErrorModalOpen,
      isLLMSettingsModalOpen,
      selectedLLMId,
    });
  }, [isTokenErrorModalOpen, isLLMSettingsModalOpen, selectedLLMId]);


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
    console.log("[ErrorModalProvider] openLLMSettingsModal with store.selectedLLMId:", selectedLLMId);
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
