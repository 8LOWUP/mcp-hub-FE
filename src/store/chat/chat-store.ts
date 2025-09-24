// store/chat/chat-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatState, Message, WorkspaceDetail, WorkspaceSummary } from "@/types/chat/chat-type";

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        historys : 
      }
    )
  ))
);