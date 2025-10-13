import { axiosInstance } from './AxiosInstance';
import { API_ENDPOINTS } from '../constants/apis/key';
import type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  User,
  McpItem,
  LoginRequest,
  SignupRequest,
  McpUploadRequest,
  McpUpdateRequest,
  ReissueTokenResponse,
} from '../types/api';

// 인증 관련 API (실제 스웨거 기반)
export const authApi = {
  // 카카오 로그인 (GET + params)
  kakaoLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    const url = API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_KAKAO;
    const config = code ? { params: { code : code } } : undefined;
    console.log('[authApi.kakaoLogin] Using GET with params:', config?.params);
    const response = await axiosInstance.get(url, config);
    console.log('[authApi.kakaoLogin] GET called. Status:', response.status, 'OK?:', response.status >= 200 && response.status < 300);
    return response.data;
  },

  // 구글 로그인 (GET + params)
  googleLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    const url = API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GOOGLE;
    const config = code ? { params: { code } } : undefined;
    console.log('[authApi.googleLogin] Using GET with params:', config?.params);
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  // 깃허브 로그인 (GET + params)
  githubLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    const url = API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GITHUB;
    const config = code ? { params: { code } } : undefined;
    console.log('[authApi.githubLogin] Using GET with params:', config?.params);
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  // 토큰 재발급
  reissueToken: async (refreshToken: string): Promise<ApiResponse<ReissueTokenResponse>> => {
    console.log('[authApi.reissueToken] Using POST with params:', { refreshToken });

    const response = await axiosInstance.post(API_ENDPOINTS.MEMBERS.AUTH_TOKEN_REISSUE, null, {
      params: { refreshToken },
    });
    return response.data;
  },

  // 로그아웃 (refreshToken을 params로 전송)
  logout: async (refreshToken?: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.MEMBERS.AUTH_LOGOUT,
      refreshToken ? { params: { refreshToken } } : undefined
    );
    return response.data;
  },
};

// 사용자(Members) 관련 API (실제 스웨거 기반)
export const membersApi = {
  // 내 정보 조회
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MEMBERS.ME);
    return response.data;
  },

  // 내 정보 수정
  updateMe: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.MEMBERS.ME, data);
    return response.data;
  },

  // 회원 탈퇴
  deleteMe: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.MEMBERS.ME);
    return response.data;
  },

  // 사용자 정보 조회
  getMember: async (memberId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MEMBERS.DETAIL.replace('{memberId}', memberId));
    return response.data;
  },

  // 사용자 검색
  searchMembers: async (params?: { q?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MEMBERS.SEARCH, { params });
    return response.data;
  },
};

// MCP 관련 API (실제 스웨거 기반)
export const mcpApi = {
  // MCP 목록 조회
  getMcps: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<McpItem>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.LIST, { params });
    return response.data;
  },

  // MCP 상세 조회
  getMcp: async (mcpId: string): Promise<ApiResponse<McpItem>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DETAIL.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 생성/수정
  createOrUpdateMcp: async (mcpId: string, data: McpUploadRequest): Promise<ApiResponse<McpItem>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MCP.DETAIL.replace('{mcpId}', mcpId), data);
    return response.data;
  },

  // MCP 삭제
  deleteMcp: async (mcpId: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.MCP.DETAIL.replace('{mcpId}', mcpId));
    return response.data;
  },

  // 내 MCP 목록
  getMyMcps: async (): Promise<ApiResponse<McpItem[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.MY_MCPS);
    return response.data;
  },

  // MCP 대시보드
  getDashboard: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    license?: string;
    platform?: string;
  }): Promise<PaginatedResponse<McpItem>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DASHBOARD, { params });
    return response.data;
  },

  // 대시보드 생성
  createDashboard: async (data: any): Promise<ApiResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MCP.DASHBOARD, data);
    return response.data;
  },

  // 특정 MCP 대시보드
  getMcpDashboard: async (mcpId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DASHBOARD_DETAIL.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 메타데이터
  getMcpMeta: async (mcpId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DASHBOARD_META.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 게시
  publishMcp: async (mcpId: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MCP.DASHBOARD_PUBLISH.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP URL
  getMcpUrl: async (mcpId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.DASHBOARD_URL.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 리뷰 조회
  getMcpReviews: async (mcpId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.REVIEW.replace('{mcpId}', mcpId));
    return response.data;
  },

  // MCP 리뷰 작성
  createMcpReview: async (mcpId: string, data: any): Promise<ApiResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MCP.REVIEW.replace('{mcpId}', mcpId), data);
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.MCP.REVIEW_DELETE.replace('{reviewId}', reviewId));
    return response.data;
  },

  // 리뷰 수정
  updateReview: async (reviewId: string, data: any): Promise<ApiResponse> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.MCP.REVIEW_DELETE.replace('{reviewId}', reviewId), data);
    return response.data;
  },

  // MCP 토큰 확인
  checkMcpToken: async (mcpId: string): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.TOKEN_CHECK.replace('{mcpId}', mcpId));
    return response.data;
  },

  // 플랫폼 토큰
  getPlatformToken: async (platformId: string): Promise<ApiResponse<{ token: string }>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MCP.TOKEN_PLATFORM.replace('{platformId}', platformId));
    return response.data;
  },
};

// 파일 관련 API (실제 스웨거 기반)
export const filesApi = {
  // 파일 목록 조회
  getFiles: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FILES.LIST);
    return response.data;
  },

  // 파일 업로드
  uploadFile: async (category: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      API_ENDPOINTS.FILES.UPLOAD.replace('{category}', category), 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // 사전 서명된 URL 생성
  getPresignedUrl: async (category: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.FILES.PRESIGNED_URL.replace('{category}', category));
    return response.data;
  },

  // 파일 삭제
  deleteFile: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.FILES.DELETE);
    return response.data;
  },
};

// LLM 관련 API (실제 스웨거 기반)
export const llmApi = {
  // LLM 목록 조회
  getLlms: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.LLM.LIST);
    return response.data;
  },

  // LLM 토큰 조회
  getLlmToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.LLM.TOKEN);
    return response.data;
  },
};

// 워크스페이스 관련 API (실제 스웨거 기반)
export const workspacesApi = {
  // 워크스페이스 목록 조회
  getWorkspaces: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.LIST);
    return response.data;
  },

  // 워크스페이스 상세 조회
  getWorkspace: async (workspaceId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.DETAIL.replace('{workspaceId}', workspaceId));
    return response.data;
  },

  // 워크스페이스 채팅 조회
  getWorkspaceChats: async (workspaceId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.CHATS.replace('{workspaceId}', workspaceId));
    return response.data;
  },

  // 워크스페이스 MCP 조회
  getWorkspaceMcps: async (workspaceId: string): Promise<ApiResponse<McpItem[]>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WORKSPACES.MCPS.replace('{workspaceId}', workspaceId));
    return response.data;
  },
};

// 통합 API 객체 (실제 스웨거 기반)
export const apiService = {
  auth: authApi,
  members: membersApi,
  mcp: mcpApi,
  files: filesApi,
  llm: llmApi,
  workspaces: workspacesApi,
};
