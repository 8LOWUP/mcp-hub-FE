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
  id: number;
  name: string;
  version: string;
  description: string;
  requestUrl: string;
  sourceUrl: string;
  imageUrl: string;
  isKeyRequired: boolean;
  categoryName: string;
  platformName: string;
  licenseName: string;
  averageRating: number;
  savedUserCount: number;
  tools: McpTool[];
  publishDate: string;
  lastPublishDate: string;
}

export interface McpTool {
  id: number;
  name: string;
  content: string;
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
