"use client";

import { create } from "zustand";

interface TokenErrorState {
  isTokenErrorModalOpen: boolean;
  errorMessage: string;
  retryCallback?: () => void;
  isLLMSettingsModalOpen: boolean;
  selectedLLMId?: string;
}

interface TokenErrorActions {
  openTokenErrorModal: (message?: string, retryCallback?: () => void) => void;
  closeTokenErrorModal: () => void;
  openLLMSettingsModal: (selectedLLMId?: string) => void;
  closeLLMSettingsModal: () => void;
  setSelectedLLMId: (llmId?: string) => void;
}

type TokenErrorStore = TokenErrorState & TokenErrorActions;

export const useTokenErrorStore = create<TokenErrorStore>((set) => ({
  // State
  isTokenErrorModalOpen: false,
  errorMessage: "",
  retryCallback: undefined,
  isLLMSettingsModalOpen: false,
  selectedLLMId: undefined,

  // Actions
  openTokenErrorModal: (message = "유효하지 않은 액세스 토큰", retryCallback) => {
    set((state) => {
      if (state.isTokenErrorModalOpen || state.isLLMSettingsModalOpen) {
        // 이미 열려 있거나 설정 모달이 열려 있으면 중복 오픈 방지
        console.log("[TokenErrorModal] open ignored (already open or LLMSettings open)");
        return state;
      }

      console.log("[TokenErrorModal] opening modal");
      return {
        isTokenErrorModalOpen: true,
        errorMessage: message,
        retryCallback,
        // 기존 상태 유지 필요 시 전개
      } as any;
    });
  },

  closeTokenErrorModal: () => {
    set({
      isTokenErrorModalOpen: false,
      errorMessage: "",
      retryCallback: undefined,
    });
  },

  openLLMSettingsModal: (selectedLLMId) => {
    set({
      isLLMSettingsModalOpen: true,
      selectedLLMId,
    });
  },

  closeLLMSettingsModal: () => {
    set({
      isLLMSettingsModalOpen: false,
      // selectedLLMId를 유지하여 모달 닫아도 선택 상태가 남도록 함
    } as any);
  },

  setSelectedLLMId: (llmId) => {
    set({ selectedLLMId: llmId });
  },
}));
