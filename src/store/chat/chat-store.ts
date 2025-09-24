// store/chat/chat-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatState, Message, WorkspaceDetail, WorkspaceSummary } from "@/types/chat/chat-type";

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        currentWorkspaceId: null,
        workspaces: [],
        workspaceCache: {},
        messagesByWorkspace: {},
        sendingByWorkspace: {},            // ✅ 추가
        loadingList: false,
        loadingDetail: false,

        // 1) 히스토리 목록 불러오기 (상세 → 목록 mock)
        loadWorkspaceList: async () => {
          set({ loadingList: true });
          try {
            const detailApiResponse: { result: WorkspaceDetail[] } = {
              result: [
                {
                  workspaceId: "1021",
                  llmId: "GPT",
                  userId: "2",
                  title: "Using Notion MCP",
                  mcps: [],
                  chats: [
                    {
                      createdAt: "2025-09-19T17:55:21.201",
                      updatedAt: "2025-09-19T17:55:21.201",
                      deletedAt: null,
                      id: "msg-1",
                      workspaceId: "1021",
                      chat: "첫번째 워크스페이스 유저 메시지",
                      new: false,
                      request: true,
                      deleted: false,
                    },
                    {
                      createdAt: "2025-09-19T17:56:10.847",
                      updatedAt: "2025-09-19T17:56:10.847",
                      deletedAt: null,
                      id: "msg-2",
                      workspaceId: "1021",
                      chat: "첫번째 워크스페이스 답변",
                      new: false,
                      request: false,
                      deleted: false,
                    },
                  ],
                },
                {
                  workspaceId: "1020",
                  llmId: "GPT",
                  userId: "2",
                  title: "Extracting information from Slack",
                  mcps: [],
                  chats: [],
                },
              ],
            };

            const detailCache: Record<string, WorkspaceDetail> = {};
            const msgCache: Record<string, Message[]> = {};
            const sendCache: Record<string, boolean> = {};  // ✅ 초기화용

            detailApiResponse.result.forEach((d) => {
              detailCache[d.workspaceId] = d;
              msgCache[d.workspaceId] = d.chats.map((c) => ({
                id: c.id,
                role: c.request ? "user" : "assistant",
                text: c.chat,
                createdAt: +new Date(c.createdAt),
              }));
              sendCache[d.workspaceId] = false;             // ✅ 기본 false
            });

            const listApiResponse: { result: WorkspaceSummary[] } = {
              result: detailApiResponse.result.map((d) => ({
                workspaceId: d.workspaceId,
                title: d.title,
                createdAt: new Date().toISOString(),
              })),
            };

            const sorted = [...listApiResponse.result].sort(
              (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
            );

            set({
              workspaces: sorted,
              workspaceCache: detailCache,
              messagesByWorkspace: msgCache,
              sendingByWorkspace: sendCache,                // ✅ 반영
            });

            if (sorted.length > 0) {
              set({ currentWorkspaceId: sorted[0].workspaceId });
            }
          } finally {
            set({ loadingList: false });
          }
        },

        // 2) 상세 열기(캐시 전제)
        openWorkspace: async (workspaceId: string) => {
          set({ currentWorkspaceId: workspaceId });
          // 필요하면 여기서 캐시 미존재 시 fetch 로직 추가
        },

        // 3) 새 대화
        startNewChat: () => {
          const id = `new-${crypto.randomUUID()}`;
          const now = new Date().toISOString();

          set((prev) => ({
            currentWorkspaceId: id,
            workspaces: [{ title: "새 대화", workspaceId: id, createdAt: now }, ...prev.workspaces],
            workspaceCache: {
              ...prev.workspaceCache,
              [id]: {
                workspaceId: id,
                llmId: "GPT",
                userId: "me",
                title: "새 대화",
                mcps: [],
                chats: [],
              },
            },
            messagesByWorkspace: { ...prev.messagesByWorkspace, [id]: [] },
            sendingByWorkspace:  { ...prev.sendingByWorkspace,  [id]: false }, // ✅ 추가
          }));

          return id;
        },

        // 4) 전송 플래그 방식
        sendMessage: async (text: string) => {
          let id = get().currentWorkspaceId;
          if (!id) id = get().startNewChat();

          // ✅ 보내는 중 true
          set((prev) => ({
            sendingByWorkspace: { ...prev.sendingByWorkspace, [id!]: true },
          }));

          const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            text,
            createdAt: Date.now(),
          };

          set((prev) => {
            const cur = prev.messagesByWorkspace[id!] ?? [];
            return {
              messagesByWorkspace: {
                ...prev.messagesByWorkspace,
                [id!]: [...cur, userMsg],
              },
            };
          });

          // 모의 지연
          await new Promise((r) => setTimeout(r, 400));

          const botMsg: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            text: `“${text}”에 대한 답변입니다.`,
            createdAt: Date.now(),
          };

          set((prev) => ({
            messagesByWorkspace: {
              ...prev.messagesByWorkspace,
              [id!]: [...(prev.messagesByWorkspace[id!] ?? []), botMsg],
            },
            sendingByWorkspace: { ...prev.sendingByWorkspace, [id!]: false }, // ✅ 끝나면 false
          }));
        },

        // 파생
        get isCurrentNew() {
          const s = get();
          return !!s.currentWorkspaceId?.startsWith("new-");
        },
        get isCurrentEmpty() {
          const s = get();
          if (!s.currentWorkspaceId) return true;
          return (s.messagesByWorkspace[s.currentWorkspaceId] ?? []).length === 0;
        },
      }),
      {
        name: "chat-store-v1",
        partialize: (s) => ({
          currentWorkspaceId: s.currentWorkspaceId,
          workspaces: s.workspaces,
          workspaceCache: s.workspaceCache,
          messagesByWorkspace: s.messagesByWorkspace,
          sendingByWorkspace: s.sendingByWorkspace, // ✅ 영속화 포함
        }),
      }
    )
  )
);