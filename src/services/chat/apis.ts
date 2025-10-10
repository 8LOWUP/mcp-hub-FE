import { API_ENDPOINTS } from "@/constants/apis/key";
import axiosInstance, { ApiResponse } from "../AxiosInstance";
import { McpItem } from "@/types/api";
import { 
  getWorkspaceHistory, 
  getWorkspaceResponse,
  postWorkspaceCreateRequestBody,
  postWorkspaceCreateResponse,
  patchWorkspaceTitleEditRequestBody,
  patchWorkspaceTitleEditResponse,
  patchMCPActiveEditRequestBody,
  patchMCPActiveEditResponse,
  deleteWorkspaceResponse,
  postWorkspaceChattingResponse,
  getWorkspaceChattingLogResponse,
  getAllLLMListResponse,
  getLLMTokenCheckResponse,
  postSettingLLMTokenRequestBody,
  postSettingLLMTokenResponse,
  patchLLMTokenRequestBody,
  patchLLMTokenResponse,
  getMCPTokenCheckResponse,
  postMCPTokenSaveRequestBody,
  postMCPTokenSaveResponse,
  getMCPTokenExistCheckResponse,
  postSendWorkspaceChatRequestBody,
  LLMInfo,
  LLMTokenInfo
} from "@/types/chat/chat-type";

// 워크스페이스 관련 API (실제 스웨거 기반)
export const workspacesApi = {
  // 워크스페이스 히스토리 조회
  getWorkspaces: async (): Promise<getWorkspaceHistory> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.LIST);
    return response.data;
  },

  // 워크스페이스 생성
  createWorkspace: async (data: postWorkspaceCreateRequestBody): Promise<postWorkspaceCreateResponse> => {
    console.log('📡 API 요청 시작:', API_ENDPOINTS.WORKSPACES.CREATE);
    console.log('📤 전송할 데이터:', JSON.stringify(data, null, 2));
    console.log('📤 데이터 타입 확인:', {
      llmId: typeof data.llmId,
      mcps: typeof data.mcps,
      mcpsIsArray: Array.isArray(data.mcps),
      mcpsLength: data.mcps?.length,
      chatMessage: typeof data.chatMessage
    });
    
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.WORKSPACES.CREATE, data);
      console.log('✅ API 응답 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ 워크스페이스 생성 API 요청 실패:');
      console.error('  - 상태 코드:', error.response?.status);
      console.error('  - 에러 메시지:', error.response?.data);
      console.error('  - 요청 URL:', API_ENDPOINTS.WORKSPACES.CREATE);
      console.error('  - 요청 데이터:', JSON.stringify(data, null, 2));
      throw error;
    }
  },

  // 채팅 기록 요청 API
  getWorkspaceChats: async (workspaceId: string, page: number = 0, size: number = 50): Promise<getWorkspaceChattingLogResponse> => {
    console.log('🌐 워크스페이스 채팅 로그 API 호출 시작:', { workspaceId, page, size });
    console.log('🌐 API 엔드포인트:', API_ENDPOINTS.WORKSPACES.CHATS.replace('{workspaceId}', workspaceId));
    
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.CHATS.replace('{workspaceId}', workspaceId), {
      params: { workspaceId : workspaceId, page : page, size : size }
    });
    
    console.log('📡 워크스페이스 채팅 로그 API 응답:', response.data);
    return response.data;
  },

  // 채팅 요청 API
  postSendWorkspaceChats: async (workspaceId: string, data: postSendWorkspaceChatRequestBody): Promise<postWorkspaceChattingResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.WORKSPACES.CHAT.replace('{workspaceId}', workspaceId), data);
    return response.data;
  },

  // 워크스페이스 상세 조회
  getWorkspaceDetail: async (workspaceId: string): Promise<getWorkspaceResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.DETAIL.replace('{workspaceId}', workspaceId), {
      params: { workspaceId : workspaceId }
    });
    return response.data;
  },

  // 워크스페이스 삭제
  deleteWorkspace: async (workspaceId: string): Promise<deleteWorkspaceResponse> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.WORKSPACES.DELETE.replace('{workspaceId}', workspaceId), {
      params: { workspaceId : workspaceId }
    });
    return response.data;
  },

  // 워크스페이스 제목 수정
  updateWorkspaceTitle: async (workspaceId: string, data: patchWorkspaceTitleEditRequestBody): Promise<patchWorkspaceTitleEditResponse> => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.WORKSPACES.UPDATE_TITLE.replace('{workspaceId}', workspaceId), 
      data,
      { params: { workspaceId : workspaceId } }
    );
    return response.data;
  },

  // 워크스페이스 MCP 활성화 여부 수정
  toggleWorkspaceMcps: async (workspaceId: string, data: patchMCPActiveEditRequestBody): Promise<patchMCPActiveEditResponse> => {
    const url = API_ENDPOINTS.WORKSPACES.UPDATE_MCPS.replace('{workspaceId}', workspaceId);
    
    console.log('🌐 API 요청 정보:');
    console.log('  - URL:', url);
    console.log('  - Method: PATCH');
    console.log('  - WorkspaceId:', workspaceId);
    console.log('  - Request Body:', data);
    console.log('  - Params:', { workspaceId });
    
    const response = await axiosInstance.patch(url, data, { params: { workspaceId : workspaceId } });
    
    console.log('✅ API 응답 성공:', response.data);
    return response.data;
  },
};

// MCP 관련 API
export const mcpApi = {
  // MCP 상세 조회
  getMCPDetail: async (mcpId: string): Promise<ApiResponse<McpItem>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DETAIL.replace('{mcpId}', mcpId), {
      params: { mcpId : mcpId }
    });
    return response.data;
  },
};

// MCP 토큰 관련 API
export const mcpTokenApi = {
  // MCP 토큰 조회
  getMCPToken: async (mcpId: string): Promise<getMCPTokenCheckResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.TOKEN_CHECK.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 토큰 저장
  saveMCPToken: async (platformId: string, data: postMCPTokenSaveRequestBody): Promise<postMCPTokenSaveResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MCP.TOKEN_PLATFORM.replace('{platformId}', platformId), data);
    return response.data;
  },

  // MCP 토큰 존재 여부 확인
  checkMCPTokenExist: async (platformId: string): Promise<getMCPTokenExistCheckResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.TOKEN_PLATFORM.replace('{platformId}', platformId));
    return response.data;
  },
};

// LLM 관련 API
export const llmApi = {
  // 사용자 LLM 토큰 조회
  getLLMTokens: async (llmId: string): Promise<getLLMTokenCheckResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.LLM.TOKEN.replace('{llmId}', llmId), {
      params: { llmId : llmId }
    });
    return response.data;
  },

  // LLM 토큰 입력
  setLLMToken: async (data: postSettingLLMTokenRequestBody): Promise<postSettingLLMTokenResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.LLM.TOKEN.replace('{llmId}', data.llmId), data, {
      params: { llmId : data.llmId, llmToken : data.llmToken }
    });
    return response.data;
  },

  // LLM 토큰 수정
  updateLLMToken: async (data: patchLLMTokenRequestBody): Promise<patchLLMTokenResponse> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.LLM.TOKEN.replace('{llmId}', data.llmId), data, {
      params: { llmId : data.llmId, llmToken : data.llmToken }
    });
    return response.data;
  },

  // 사용 가능한 모든 LLM 전체 리스트 조회
  getAllLLMs: async (): Promise<getAllLLMListResponse> => {
    console.log('🌐 LLM 목록 API 호출:', API_ENDPOINTS.LLM.LIST);
    const response = await axiosInstance.get(API_ENDPOINTS.LLM.LIST);
    console.log('📡 LLM 목록 API 응답:', response.data);
    return response.data;
  },
};