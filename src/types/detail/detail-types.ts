// src/types/detail/detail-types.ts

// ✅ MCP 툴 정의
export interface McpTool {
    id: number;
    name: string;
    content: string;
}

// ✅ MCP 상세 정의 (Swagger + FE 확장 필드)
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
    publishDate: string | null;   // null 가능성 반영
    lastPublishDate: string | null;
    developerName: string;

    // 📌 FE 확장 필드
    about?: string;
    connectionPlatform?: string[];
    url?: string;
    reviews?: Review[];
}

// ✅ 리뷰 타입 따로 분리
export interface Review {
    id: number;
    content: string;
    rating: number;
    author: string;
    createdAt: string;
}

// ✅ 공통 API 응답 타입
export interface ApiResponse<T = any> {
    result: T;
    message?: string;
    timestamp?: string;
    code?: string;
}
