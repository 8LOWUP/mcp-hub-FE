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

export type WorkSpaceHistory = CommonResponse<WorkspaceSummary[]>

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


//워크 스페이스 생성
export type mcpInfo = {
  id : string,
  active : boolean
}

export type WorkspaceCreateRequestBody = {
	llmId: string,
	mcps : mcpInfo[],
	chatRequest: string
}

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
	mcps : mcpInfo[],	  
	chats : chatDetail[]
}>

// 워크 스페이스 제목 수정
export type fetchWorkspaceTitleEditRequestBody = {
  title : string
}

export type fetchWorkspaceTitleEditResponse = {
  title : string
}