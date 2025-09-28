"use client";

import { create } from "zustand";

type ModalState = {
  // History menu modal
  historyMenuModal: {
    isOpen: boolean;
    workspaceId: string;
    title: string;
    anchorRect: { top: number; left: number; width: number; height: number } | null;
  };
  
  // Model selector modal
  modelSelectorModal: {
    isOpen: boolean;
    currentModel: string;
    anchorRect: { top: number; left: number; width: number; height: number } | null;
  };

  // Inline rename signal
  editTargetWorkspaceId: string | null;
  
  // Confirm modal
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm?: () => void;
  };
};

type ModalActions = {
  // History menu modal actions
  openHistoryMenuModal: (workspaceId: string, title: string, anchorRect: DOMRect) => void;
  closeHistoryMenuModal: () => void;
  
  // Model selector modal actions
  openModelSelectorModal: (currentModel: string, anchorRect: DOMRect) => void;
  closeModelSelectorModal: () => void;
  
  // General modal actions
  closeAllModals: () => void;

  // Inline edit actions
  startEditTitle: (workspaceId: string) => void;
  clearEditTitle: () => void;
  
  // Confirm modal actions
  openConfirmModal: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => void;
  closeConfirmModal: () => void;
};

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  // Initial state
  historyMenuModal: {
    isOpen: false,
    workspaceId: "",
    title: "",
    anchorRect: null,
  },
  
  modelSelectorModal: {
    isOpen: false,
    currentModel: "gpt-4",
    anchorRect: null,
  },

  editTargetWorkspaceId: null,
  
  confirmModal: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    isDestructive: false,
    onConfirm: undefined,
  },
  
  // Actions
  openHistoryMenuModal: (workspaceId: string, title: string, anchorRect: DOMRect) =>
    set({
      historyMenuModal: {
        isOpen: true,
        workspaceId,
        title,
        anchorRect,
      },
    }),
    
  closeHistoryMenuModal: () =>
    set({
      historyMenuModal: {
        isOpen: false,
        workspaceId: "",
        title: "",
        anchorRect: null,
      },
    }),
    
  openModelSelectorModal: (currentModel: string, anchorRect: DOMRect) =>
    set({
      modelSelectorModal: {
        isOpen: true,
        currentModel,
        anchorRect,
      },
    }),
    
  closeModelSelectorModal: () =>
    set({
      modelSelectorModal: {
        isOpen: false,
        currentModel: "gpt-4",
        anchorRect: null,
      },
    }),
    
  closeAllModals: () =>
    set({
      historyMenuModal: {
        isOpen: false,
        workspaceId: "",
        title: "",
        anchorRect: null,
      },
      modelSelectorModal: {
        isOpen: false,
        currentModel: "gpt-4",
        anchorRect: null,
      },
      editTargetWorkspaceId: null,
    }),

  startEditTitle: (workspaceId: string) =>
    set({ editTargetWorkspaceId: workspaceId, historyMenuModal: { isOpen: false, workspaceId: "", title: "", anchorRect: null } }),

  clearEditTitle: () => set({ editTargetWorkspaceId: null }),
  
  openConfirmModal: (config) =>
    set({
      confirmModal: {
        isOpen: true,
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || "확인",
        cancelText: config.cancelText || "취소",
        isDestructive: config.isDestructive || false,
        onConfirm: config.onConfirm,
      },
    }),
    
  closeConfirmModal: () =>
    set({
      confirmModal: {
        isOpen: false,
        title: "",
        message: "",
        confirmText: "확인",
        cancelText: "취소",
        isDestructive: false,
        onConfirm: undefined,
      },
    }),
}));
