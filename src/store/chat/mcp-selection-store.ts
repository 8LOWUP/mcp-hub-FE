import { create } from "zustand";
import type { mcpInfo } from "@/types/chat/chat-type";

type McpSelectionState = {
  // 전체 MCP 선택 상태 (id, active)
  selectedMcps: mcpInfo[];
  // 일괄 설정 (초기화/동기화)
  setAll: (mcps: mcpInfo[]) => void;
  // 단일 토글
  toggle: (mcpId: string, next: boolean) => void;
  // 활성(true)만 반환
  getActiveList: () => mcpInfo[];
};

export const useMcpSelectionStore = create<McpSelectionState>((set, get) => ({
  selectedMcps: [],
  setAll: (mcps) => set({ selectedMcps: mcps }),
  toggle: (mcpId, next) =>
    set((s) => ({
      selectedMcps: s.selectedMcps.map((m) =>
        m.id === mcpId ? { ...m, active: next } : m
      ),
    })),
  getActiveList: () => (get().selectedMcps || []).filter((m) => m.active),
}));


