// types/chat/chat-type.ts

export type Role = "user" | "assistant";

export type MessageState = "normal" | "loading" | "error";

export type Message = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  state?: MessageState; // ← optional (기본 normal)
};

export type WorkspaceSummary = {
  title: string;
  workspaceId: string;
  createdAt: string;
};

export type WorkspaceDetail = {
  workspaceId: string;
  llmId: string;
  userId: string;
  title: string;
  mcps: { id: string; active: boolean }[];
  chats: Array<{
    id: string;
    workspaceId: string;
    chat: string;
    request: boolean; // true=user, false=assistant
    new: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;
};

export type ChatState = {
  currentWorkspaceId: string | null;

  // 전체 히스토리 목록 (좌측 사이드바)
  workspaces: WorkspaceSummary[];

  // 상세 캐시
  workspaceCache: Record<string, WorkspaceDetail>;

  // 변환된 메시지
  messagesByWorkspace: Record<string, Message[]>;

  // 상태 플래그
  loadingList: boolean;
  loadingDetail: boolean;

  // 액션
  loadWorkspaceList: () => Promise<void>;
  openWorkspace: (workspaceId: string) => Promise<void>;
  startNewChat: () => string;
  sendMessage: (text: string) => Promise<void>;

  // 파생 상태
  isCurrentNew: boolean;
  isCurrentEmpty: boolean;
};
