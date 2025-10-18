// types/chat/chat-type.ts

import { CommonResponse } from "../common";

export type Role = "user" | "assistant";

export type MessageState = "normal" | "loading" | "error";

export type Message = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  state?: MessageState; 
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

// 워크스페이스 히스토리 조회
export type getWorkspaceHistory = CommonResponse<WorkspaceSummary[]>

//워크 스페이스 생성
export type mcpInfo = {
  id? : string,
  active? : boolean
};

export type postWorkspaceCreateRequestBody = {
	llmId: string,
	mcps : mcpInfo[],
	chatMessage: string
}

export type postWorkspaceCreateResponse = CommonResponse<{
  userId : string
  workspaceId : string
  llmId : string
  mcps : mcpInfo[]
  chatResponse : {}
  title : string
  createdAt : string
}>

// 워크 스페이스 조회
export type chatDetail = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  workspaceId: string;
  chat: string;
  new: boolean;
  request: boolean; // true=user, false=assistant
  deleted: boolean;
}

export type getWorkspaceResponse = CommonResponse<{
  workspaceId : string,
	llmId : string,
	userId : string,
	title : string,
	mcps : mcpInfo[]
}>

// 워크 스페이스 제목 수정
export type patchWorkspaceTitleEditRequestBody = {
  title : string
}

export type patchWorkspaceTitleEditResponse = CommonResponse<{
  workspaceId : string
  title : string
  updatedAt : string
}>

// 워크스페이스 MCP 활성화 수정
export type patchMCPActiveEditRequestBody = {
  mcps: mcpInfo[]
}

export type patchMCPActiveEditResponse = CommonResponse<string>

// 워크스페이스 삭제
export type deleteWorkspaceResponse = CommonResponse<string>

// 워크스페이스 채팅
export type ChatLogItem = {
  chatMessage: string;
  isRequest: boolean;
  createdAt: string;
}

export type SortInfo = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export type PageableInfo = {
  offset: number;
  sort: SortInfo;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export type ChatLogPage = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ChatLogItem[];
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  pageable: PageableInfo;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type getWorkspaceChattingLogResponse = CommonResponse<ChatLogPage>

export type postSendWorkspaceChatRequestBody = {
  chatMessage : string
  llmId? : string
}

export type postWorkspaceChattingResponse = CommonResponse<{
  workspaceId : string
  llmResponse : string
}>

// LLM 전체 리스트 조회
export type getAllLLMListResponse = {
  code: string;
  timestamp: string;
  message: string;
  llmList: LLMInfo[];
}

// 사용자 LLM 토큰 조회
export type getLLMTokenCheckResponse = CommonResponse<{
  llmId: string;
  exists: boolean;
  llmToken: string;
}>

// LLM 토큰 입력
export type postSettingLLMTokenRequestBody = {
  llmId : string
  llmToken : string
}

export type postSettingLLMTokenResponse = CommonResponse<{
  llmToken : string
}>

// LLM 토큰 수정
export type patchLLMTokenRequestBody = {
  llmId : string
  llmToken : string
}

export type patchLLMTokenResponse = CommonResponse<{
  llmId : string
}>

// MCP 토큰 조회
export type getMCPTokenCheckRequestBody = {
  token : string
}

export type getMCPTokenCheckResponse = CommonResponse<{
  mcpId : string
  token : string
}>

// MCP 토큰 저장
export type postMCPTokenSaveRequestBody = {
  token : string
}

export type postMCPTokenSaveResponse = CommonResponse<{
  mcpId : string
}>

// MCP 토큰 존재 여부 확인
export type getMCPTokenExistCheckResponse = CommonResponse<{
  platformId : string
  isTokenExist : boolean
}>

// LLM 관련 API 타입들
export type LLMInfo = {
  llmId: string;
  modelName: string;
  llmProvider: string;
}

export type LLMTokenInfo = {
  llmId: string;
  token: string;
}

// MCP 관련 API 타입들
export type MCPTokenInfo = {
  mcpId: string;
  token: string;
}

export type MCPTokenExistInfo = {
  platformId: string;
  isTokenExist: boolean;
}

// ===== Local UI/Store types for chat page =====
export type MessagesByWorkspace = Record<string, Message[]>;
export type SendingByWorkspace = Record<string, boolean>;

export type ChatState = {
  // list/selection
  workspaces: WorkspaceSummary[];
  currentWorkspaceId: string | null; // "new-..." for not yet created

  // message cache per workspaces
  messagesByWorkspace: MessagesByWorkspace;
  sendingByWorkspace: SendingByWorkspace;

  // detail cache per workspaces (Active MCP etc.)
  workspaceCache: Record<string, Partial<WorkspaceDetail> & { selectedMcpId?: string } >;

  // ui loading flags
  loadingList: boolean;
  loadingDetailByWorkspace: Record<string, boolean>;

  // actions (no networking for now)
  loadWorkspaceList: () => Promise<void> | void;
  openWorkspace: (workspaceId: string) => void;
  startNewChat: () => void;
  sendMessage: (text: string) => Promise<void> | void;
  deleteWorkspace: (workspaceId: string) => void;
  renameWorkspace: (workspaceId: string, newTitle: string) => void;
};