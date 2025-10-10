// API 관련 타입 정의

// 기본 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  result?: T;
  message?: string;
  error?: string;
  code?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 인증 관련 타입
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  member: User;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// MCP 관련 타입
export interface McpItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconSrc: string;
  usersCount: number;
  saved: boolean;
  developer: string;
  license: string;
  sourceCodeUrl?: string;
  serverUrl?: string;
  tags: string[];
  tools: McpTool[];
  platforms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface McpTool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

// 에러 타입
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// 요청 타입들
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface McpUploadRequest {
  title: string;
  description: string;
  category: string;
  developer: string;
  license: string;
  sourceCodeUrl?: string;
  serverUrl?: string;
  tags: string[];
  tools: McpTool[];
  platforms: string[];
}

export interface McpUpdateRequest extends Partial<McpUploadRequest> {
  id: string;
}
