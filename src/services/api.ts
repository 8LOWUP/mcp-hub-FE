// src/services/api.ts
import axiosInstance from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import { useLoginStore } from "@/store/login/login-store";

import type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  User,
  McpItem,
  LoginRequest,       // 사용 예정이면 유지
  SignupRequest,      // 사용 예정이면 유지
  McpUploadRequest,
  McpUpdateRequest,   // 사용 예정이면 유지
} from "@/types/api";

/* =========================================
 * 유틸: 경로 앞에 슬래시 강제 (baseURL 결합 안정화)
 * ========================================= */
const withLeadingSlash = (p: string) => (p?.startsWith("/") ? p : `/${p}`);

/* =========================================
 * 인증 관련 API
 * - 카카오 로그인: 프리픽스×경로×메서드/페이로드 순차 재시도
 * - reissueToken / deleteMe: refreshToken을 query로 전송
 * - 모든 경로 정규화
 * ========================================= */
export const authApi = {
  // 카카오 로그인 (다변 환경 흡수)
  kakaoLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    if (!code) throw new Error("kakaoLogin: code가 필요합니다.");

    // 1) 경로 후보 (뒤쪽일수록 레거시/대체)
    const basePaths = [
      API_ENDPOINTS?.MEMBERS?.AUTH_SOCIAL_KAKAO, // 보통: /members/auth/social/kakao
      "/members/auth/social/kakao/callback",
      "/members/auth/kakao",
      "/auth/social/kakao",
      "/auth/kakao",
      "/oauth2/callback/kakao",
    ]
        .filter(Boolean)
        .map(withLeadingSlash);

    // 2) 프리픽스 후보 (서버가 /api, /v1 등을 요구할 수 있음)
    const prefixes = ["", "/api", "/v1", "/v1/api"].map(withLeadingSlash);

    // 3) 메서드/페이로드 케이스
    type TryCase = { method: "get" | "post"; useParams: boolean; useBody: boolean };
    const cases: TryCase[] = [
      { method: "get",  useParams: true,  useBody: false }, // GET /... ?code=...
      { method: "post", useParams: true,  useBody: false }, // POST /... (null, { params })
      { method: "post", useParams: false, useBody: true  }, // POST /... ({ code })
    ];

    // 4) 한 번 호출
    const tryOnce = async (fullPath: string, c: TryCase) => {
      const url = withLeadingSlash(fullPath);

      // 실제 요청 URL 프리뷰 출력
      const uriPreview = axiosInstance.getUri({
        url,
        params: c.method === "get" || c.useParams ? { code } : undefined,
      });
      // eslint-disable-next-line no-console
      console.log("[auth.kakaoLogin] TRY", {
        method: c.method, url, uriPreview, useParams: c.useParams, useBody: c.useBody,
      });

      if (c.method === "get") {
        const res = await axiosInstance.get(url, { params: c.useParams ? { code } : undefined });
        return res.data as ApiResponse<AuthResponse>;
      }
      if (c.useParams) {
        const res = await axiosInstance.post(url, null, { params: { code } });
        return res.data as ApiResponse<AuthResponse>;
      }
      if (c.useBody) {
        const res = await axiosInstance.post(url, { code });
        return res.data as ApiResponse<AuthResponse>;
      }
      // fallback(도달 거의 안 함)
      const res = await axiosInstance.post(url, null);
      return res.data as ApiResponse<AuthResponse>;
    };

    let lastErr: any = null;

    // 5) prefix × path × case 순차 시도
    for (const prefix of prefixes) {
      for (const basePath of basePaths) {
        const fullPath = (prefix === "/" ? "" : prefix) + basePath; // "//" 방지
        for (const c of cases) {
          try {
            const data = await tryOnce(fullPath, c);
            // eslint-disable-next-line no-console
            console.log("[auth.kakaoLogin] ✅ 성공:", { fullPath, case: c });
            return data;
          } catch (e: any) {
            const status = e?.response?.status;
            // eslint-disable-next-line no-console
            console.warn("[auth.kakaoLogin] 실패:", { fullPath, case: c, status });
            lastErr = e;
            continue; // 다음 후보 계속
          }
        }
      }
    }

    throw lastErr ?? new Error("kakaoLogin 실패: 가능한 모든 경로/프리픽스/메서드 시도 실패");
  },

  // 구글 로그인 (GET + params)
  googleLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GOOGLE);
    const config = code ? { params: { code } } : undefined;
    // eslint-disable-next-line no-console
    console.log("[authApi.googleLogin] GET", url, "params:", config?.params);
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  // 깃허브 로그인 (GET + params)
  githubLogin: async (code?: string): Promise<ApiResponse<AuthResponse>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GITHUB);
    const config = code ? { params: { code } } : undefined;
    // eslint-disable-next-line no-console
    console.log("[authApi.githubLogin] GET", url, "params:", config?.params);
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  // 토큰 재발급 (refreshToken을 query로 전송)
  reissueToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.AUTH_TOKEN_REISSUE);
    const { refreshToken } = useLoginStore.getState();
    const response = await axiosInstance.post(url, null, { params: { refreshToken } });
    return response.data;
  },

  // 로그아웃 (refreshToken을 params로 전송)
  logout: async (refreshToken?: string): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.AUTH_LOGOUT);
    const response = await axiosInstance.delete(
        url,
        refreshToken ? { params: { refreshToken } } : undefined
    );
    return response.data;
  },
};

/* =========================================
 * 사용자(Members) 관련 API
 * ========================================= */
export const membersApi = {
  // 내 정보 조회
  getMe: async (): Promise<ApiResponse<User>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.ME);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 내 정보 수정
  updateMe: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.ME);
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  // 회원 탈퇴 (refreshToken 필요)
  deleteMe: async (): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.ME);
    const { refreshToken } = useLoginStore.getState();
    const response = await axiosInstance.delete(url, { params: { refreshToken } });
    return response.data;
  },

  // 사용자 정보 조회
  getMember: async (memberId: string): Promise<ApiResponse<User>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.DETAIL.replace("{memberId}", memberId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 사용자 검색
  searchMembers: async (params?: { q?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MEMBERS.SEARCH);
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },
};

/* =========================================
 * MCP 관련 API
 * ========================================= */
export const mcpApi = {
  // MCP 목록 조회
  getMcps: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<McpItem>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.LIST);
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  // MCP 상세 조회
  getMcp: async (mcpId: string): Promise<ApiResponse<McpItem>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // MCP 생성/수정
  createOrUpdateMcp: async (mcpId: string, data: McpUploadRequest): Promise<ApiResponse<McpItem>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", mcpId));
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  // MCP 삭제
  deleteMcp: async (mcpId: string): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DETAIL.replace("{mcpId}", mcpId));
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  // 내 MCP 목록
  getMyMcps: async (): Promise<ApiResponse<McpItem[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.MY_MCPS);
    const response = await axiosInstance.get(url);
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
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD);
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  // 대시보드 생성
  createDashboard: async (data: any): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD);
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  // 특정 MCP 대시보드
  getMcpDashboard: async (mcpId: string): Promise<ApiResponse<any>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD_DETAIL.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // MCP 메타데이터
  getMcpMeta: async (mcpId: string): Promise<ApiResponse<any>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD_META.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // MCP 게시
  publishMcp: async (mcpId: string): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD_PUBLISH.replace("{mcpId}", mcpId));
    const response = await axiosInstance.post(url);
    return response.data;
  },

  // MCP URL
  getMcpUrl: async (mcpId: string): Promise<ApiResponse<{ url: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.DASHBOARD_URL.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // MCP 리뷰 조회
  getMcpReviews: async (mcpId: string): Promise<ApiResponse<any[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.REVIEW.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // MCP 리뷰 작성
  createMcpReview: async (mcpId: string, data: any): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.REVIEW.replace("{mcpId}", mcpId));
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: string): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.REVIEW_DELETE.replace("{reviewId}", reviewId));
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  // 리뷰 수정
  updateReview: async (reviewId: string, data: any): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.REVIEW_DELETE.replace("{reviewId}", reviewId));
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  // MCP 토큰 확인
  checkMcpToken: async (mcpId: string): Promise<ApiResponse<{ valid: boolean }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.TOKEN_CHECK.replace("{mcpId}", mcpId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 플랫폼 토큰
  getPlatformToken: async (platformId: string): Promise<ApiResponse<{ token: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.MCP.TOKEN_PLATFORM.replace("{platformId}", platformId));
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

/* =========================================
 * 파일 관련 API
 * ========================================= */
export const filesApi = {
  // 파일 목록 조회
  getFiles: async (): Promise<ApiResponse<any[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.FILES.LIST);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 파일 업로드
  uploadFile: async (category: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.FILES.UPLOAD.replace("{category}", category));
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 사전 서명된 URL 생성
  getPresignedUrl: async (category: string): Promise<ApiResponse<{ url: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.FILES.PRESIGNED_URL.replace("{category}", category));
    const response = await axiosInstance.post(url);
    return response.data;
  },

  // 파일 삭제
  deleteFile: async (): Promise<ApiResponse> => {
    const url = withLeadingSlash(API_ENDPOINTS.FILES.DELETE);
    const response = await axiosInstance.delete(url);
    return response.data;
  },
};

/* =========================================
 * LLM 관련 API
 * ========================================= */
export const llmApi = {
  // LLM 목록 조회
  getLlms: async (): Promise<ApiResponse<any[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.LLM.LIST);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // LLM 토큰 조회
  getLlmToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const url = withLeadingSlash(API_ENDPOINTS.LLM.TOKEN);
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

/* =========================================
 * 워크스페이스 관련 API
 * ========================================= */
export const workspacesApi = {
  // 워크스페이스 목록 조회
  getWorkspaces: async (): Promise<ApiResponse<any[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.WORKSPACES.LIST);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 워크스페이스 상세 조회
  getWorkspace: async (workspaceId: string): Promise<ApiResponse<any>> => {
    const url = withLeadingSlash(API_ENDPOINTS.WORKSPACES.DETAIL.replace("{workspaceId}", workspaceId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 워크스페이스 채팅 조회
  getWorkspaceChats: async (workspaceId: string): Promise<ApiResponse<any[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.WORKSPACES.CHATS.replace("{workspaceId}", workspaceId));
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // 워크스페이스 MCP 조회
  getWorkspaceMcps: async (workspaceId: string): Promise<ApiResponse<McpItem[]>> => {
    const url = withLeadingSlash(API_ENDPOINTS.WORKSPACES.MCPS.replace("{workspaceId}", workspaceId));
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

/* =========================================
 * 통합 API 객체
 * ========================================= */
export const apiService = {
  auth: authApi,
  members: membersApi,
  mcp: mcpApi,
  files: filesApi,
  llm: llmApi,
  workspaces: workspacesApi,
};
