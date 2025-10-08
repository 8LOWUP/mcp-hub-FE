// API 관련 상수 정의
export const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
} as const;

// API Base URL (스웨거 문서 기반)
export const API_BASE_URL = 'http://61.109.236.22';

// API 엔드포인트 상수 (실제 스웨거 문서 기반)
export const API_ENDPOINTS = {
  // 파일 관련
  FILES: {
    LIST: '/files',
    UPLOAD: '/files/{category}',
    PRESIGNED_URL: '/files/presigned-url/{category}',
    DELETE: '/files',
  },
  // LLM 관련
  LLM: {
    LIST: '/llm',
    TOKEN: '/llm/token',
  },
  // MCP 관련
  MCP: {
    LIST: '/mcps',
    DASHBOARD: '/mcps/dashboard',
    DASHBOARD_CATEGORY: '/mcps/dashboard/category',
    DASHBOARD_LICENSE: '/mcps/dashboard/license',
    DASHBOARD_PLATFORM: '/mcps/dashboard/platform',
    DASHBOARD_DETAIL: '/mcps/dashboard/{mcpId}',
    DASHBOARD_META: '/mcps/dashboard/meta',
    DASHBOARD_PUBLISH: '/mcps/dashboard/publish',
    DASHBOARD_URL: '/mcps/dashboard/{mcpId}/url',
    MY_MCPS: '/mcps/me',
    REVIEW: '/mcps/review/{mcpId}',
    REVIEW_DELETE: '/mcps/review/{reviewId}',
    TOKEN_CHECK: '/mcps/token/check/{mcpId}',
    TOKEN_PLATFORM: '/mcps/token/{platformId}',
    DETAIL: '/mcps/{mcpId}',
  },
  // 사용자(Members) 관련
  MEMBERS: {
    ME: '/members/me',
    DETAIL: '/members/{memberId}',
    SEARCH: '/members/search',
    // 인증 관련
    AUTH_LOGOUT: '/members/auth/logout',
    AUTH_TOKEN_REISSUE: '/members/auth/token/reissue',
    AUTH_SOCIAL_KAKAO: '/members/auth/social/kakao',
    AUTH_SOCIAL_GOOGLE: '/members/auth/social/google',
    AUTH_SOCIAL_GITHUB: '/members/auth/social/github',
  },
  // 워크스페이스 관련
  WORKSPACES: {
    LIST: '/workspaces',
    DETAIL: '/workspaces/{workspaceId}',
    CHATS: '/workspaces/{workspaceId}/chats',
    MCPS: '/workspaces/{workspaceId}/mcps',
  },
} as const;

// 공개 API 경로 (인증이 필요하지 않은 경로)
export const PUBLIC_PATHS = [
  // 소셜 로그인 관련
  API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_KAKAO,
  API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GOOGLE,
  API_ENDPOINTS.MEMBERS.AUTH_SOCIAL_GITHUB,
  // MCP 공개 정보
  API_ENDPOINTS.MCP.LIST,
  //API_ENDPOINTS.MCP.DASHBOARD,
  API_ENDPOINTS.MCP.DASHBOARD_CATEGORY,
  API_ENDPOINTS.MCP.DASHBOARD_LICENSE,
  API_ENDPOINTS.MCP.DASHBOARD_PLATFORM,
  API_ENDPOINTS.MCP.DETAIL,
  API_ENDPOINTS.MCP.REVIEW,
  // LLM 공개 정보
  API_ENDPOINTS.LLM.LIST,
  // 사용자 검색
  API_ENDPOINTS.MEMBERS.SEARCH,
  API_ENDPOINTS.MEMBERS.DETAIL,
] as const;

// HTTP 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API 응답 코드 상수
export const API_RESPONSE_CODE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// 파일 업로드 관련 상수
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain', 'application/json'],
} as const;

// 페이지네이션 관련 상수
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
