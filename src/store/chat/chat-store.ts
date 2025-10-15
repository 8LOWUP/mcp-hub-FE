// store/chat/chat-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ChatState, Message, WorkspaceDetail, WorkspaceSummary } from "@/types/chat/chat-type";

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== state =====
        workspaces: [],
        currentWorkspaceId: null,
        messagesByWorkspace: {},
        sendingByWorkspace: {},
        workspaceCache: {},
        loadingList: false,
        loadingDetailByWorkspace: {},

        // ===== actions =====
        loadWorkspaceList: async () => {
          if (get().loadingList) return;
          set({ loadingList: true });
          try {
            // For now, create a few mock workspaces
            const now = new Date();
            const list: WorkspaceSummary[] = [
              {
                title: "Getting started with MCP",
                workspaceId: "ws-1",
                createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
              },
              {
                title: "Project ideas",
                workspaceId: "ws-2",
                createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
              },
            ];
            set({ workspaces: list });

            // seed minimal messages for demo
            const messagesByWorkspace: Record<string, Message[]> = {
              "ws-1": [
                { id: "m1", role: "assistant", text: "무엇을 도와드릴까요?", createdAt: Date.now() - 20000 },
              ],
              "ws-2": [
                { id: "m2", role: "assistant", text: "아이디어를 함께 브레인스토밍해요!", createdAt: Date.now() - 15000 },
              ],
            };
            set({ messagesByWorkspace });

            // open first if nothing selected
            if (!get().currentWorkspaceId && list.length > 0) {
              set({ currentWorkspaceId: list[0].workspaceId });
            }
          } finally {
            set({ loadingList: false });
          }
        },

        openWorkspace: (workspaceId: string) => {
          const exists = get().workspaces.some((w) => w.workspaceId === workspaceId) || workspaceId.startsWith("new-");
          if (!exists) return;
          const isNew = workspaceId.startsWith("new-");
          if (isNew) {
            // 새 채팅은 로딩 스켈레톤 없이 즉시 전환
            set({ currentWorkspaceId: workspaceId });
            return;
          }
          // mark loading for a short delay to show transition UI
          set((prev) => ({
            currentWorkspaceId: workspaceId,
            loadingDetailByWorkspace: {
              ...prev.loadingDetailByWorkspace,
              [workspaceId]: true,
            },
          }));
          // simulate brief fetch delay
          setTimeout(() => {
            const after = get().loadingDetailByWorkspace;
            set({
              loadingDetailByWorkspace: {
                ...after,
                [workspaceId]: false,
              },
            });
          }, 1000);
        },

        startNewChat: () => {
          const newId = `new-${Math.random().toString(36).slice(2, 8)}`;
          const nowIso = new Date().toISOString();
          const title = "New chat";
          const summary: WorkspaceSummary = { title, workspaceId: newId, createdAt: nowIso };
          set((prev) => ({
            workspaces: [summary, ...prev.workspaces],
            currentWorkspaceId: newId,
            messagesByWorkspace: {
              ...prev.messagesByWorkspace,
              [newId]: [],
            },
            workspaceCache: {
              ...prev.workspaceCache,
              [newId]: { workspaceId: newId, title, mcps: [] } as Partial<WorkspaceDetail>,
            },
          }));
        },

        sendMessage: async (text: string) => {
          const currentId = get().currentWorkspaceId;
          if (!currentId) return;

          const isNew = currentId.startsWith("new-");

          // Prepare user message
          const userMsg: Message = {
            id: `msg-${Math.random().toString(36).slice(2, 9)}`,
            role: "user",
            text,
            createdAt: Date.now(),
            state: "normal",
          };

          if (isNew) {
            // Convert new chat to a real workspaces immediately on first send
            const newWorkspaceId = `ws-${Math.random().toString(36).slice(2, 8)}`;
            const newTitle = text.trim().slice(0, 30) || "New chat";

            set((prev) => {
              const oldMsgs = prev.messagesByWorkspace[currentId] ?? [];
              const updatedMsgs = [...oldMsgs, userMsg];

              // replace workspaces summary entry
              const updatedList: WorkspaceSummary[] = prev.workspaces.map((w) =>
                w.workspaceId === currentId ? { ...w, workspaceId: newWorkspaceId, title: newTitle } : w
              );

              const { [currentId]: _oldSending, ...restSending } = prev.sendingByWorkspace;
              const { [currentId]: _oldMsgs, ...restMsgs } = prev.messagesByWorkspace as Record<string, Message[]>;
              const { [currentId]: oldCache, ...restCache } = prev.workspaceCache as Record<string, Partial<WorkspaceDetail>>;

              return {
                workspaces: updatedList,
                currentWorkspaceId: newWorkspaceId,
                messagesByWorkspace: {
                  ...restMsgs,
                  [newWorkspaceId]: updatedMsgs,
                },
                sendingByWorkspace: {
                  ...restSending,
                  [newWorkspaceId]: true,
                },
                workspaceCache: {
                  ...restCache,
                  [newWorkspaceId]: { ...(oldCache ?? {}), workspaceId: newWorkspaceId, title: newTitle },
                },
              };
            });

            // fake assistant response
            await new Promise((r) => setTimeout(r, 700));
            const reply: Message = {
              id: `msg-${Math.random().toString(36).slice(2, 9)}`,
              role: "assistant",
              text: `"${text}" 에 대한 답변입니다. (demo)`,
              createdAt: Date.now(),
              state: "normal",
            };

            const newIdAfter = get().currentWorkspaceId || newWorkspaceId;
            set((prev) => ({
              messagesByWorkspace: {
                ...prev.messagesByWorkspace,
                [newIdAfter]: [...(prev.messagesByWorkspace[newIdAfter] ?? []), reply],
              },
              sendingByWorkspace: { ...prev.sendingByWorkspace, [newIdAfter]: false },
            }));
            return;
          }

          // Existing workspaces flow
          set((prev) => ({
            messagesByWorkspace: {
              ...prev.messagesByWorkspace,
              [currentId]: [...(prev.messagesByWorkspace[currentId] ?? []), userMsg],
            },
            sendingByWorkspace: { ...prev.sendingByWorkspace, [currentId]: true },
          }));

          await new Promise((r) => setTimeout(r, 700));
          const reply: Message = {
            id: `msg-${Math.random().toString(36).slice(2, 9)}`,
            role: "assistant",
            text: `"${text}" 에 대한 답변입니다. (demo)`,
            createdAt: Date.now(),
            state: "normal",
          };
          set((prev) => ({
            messagesByWorkspace: {
              ...prev.messagesByWorkspace,
              [currentId]: [...(prev.messagesByWorkspace[currentId] ?? []), reply],
            },
            sendingByWorkspace: { ...prev.sendingByWorkspace, [currentId]: false },
          }));
        },

        deleteWorkspace: (workspaceId: string) => {
          set((prev) => {
            const { [workspaceId]: _deleted, ...restMessages } = prev.messagesByWorkspace;
            const { [workspaceId]: _deletedSending, ...restSending } = prev.sendingByWorkspace;
            const { [workspaceId]: _deletedCache, ...restCache } = prev.workspaceCache;
            const { [workspaceId]: _deletedLoading, ...restLoading } = prev.loadingDetailByWorkspace;

            const updatedWorkspaces = prev.workspaces.filter((w) => w.workspaceId !== workspaceId);
            const newCurrentId = prev.currentWorkspaceId === workspaceId 
              ? (updatedWorkspaces.length > 0 ? updatedWorkspaces[0].workspaceId : null)
              : prev.currentWorkspaceId;

            return {
              workspaces: updatedWorkspaces,
              currentWorkspaceId: newCurrentId,
              messagesByWorkspace: restMessages,
              sendingByWorkspace: restSending,
              workspaceCache: restCache,
              loadingDetailByWorkspace: restLoading,
            };
          });
        },

        renameWorkspace: (workspaceId: string, newTitle: string) => {
          set((prev) => ({
            workspaces: prev.workspaces.map((w) =>
              w.workspaceId === workspaceId ? { ...w, title: newTitle } : w
            ),
            workspaceCache: {
              ...prev.workspaceCache,
              [workspaceId]: {
                ...prev.workspaceCache[workspaceId],
                title: newTitle,
              },
            },
          }));
        },
      }),
      {
        name: "chat-store",
        partialize: (state) => ({
          workspaces: state.workspaces,
          currentWorkspaceId: state.currentWorkspaceId,
          messagesByWorkspace: state.messagesByWorkspace,
          workspaceCache: state.workspaceCache,
        }),
      }
    )
  )
);