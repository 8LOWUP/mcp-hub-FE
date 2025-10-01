// src/types/upload/upload-types.ts

// MCP Meta 저장 요청 타입
// PATCH /mcps/dashboard/{mcpId}/meta 요청 바디
export interface McpMetaPayload {
    name: string;
    description: string;
    sourceUrl: string;
    imageUrl: string;
    requestUrl: string;
    developerName: string;
    isKeyRequired: boolean;
    categoryId: number;   // 프론트에서 매핑
    platformName: string;
    licenseId: number;    // 프론트에서 매핑
    tools: {
        name: string;
        content?: string;
    }[];
}

// Draft 생성 응답
// POST /mcps/dashboard 응답 (draft 생성)
export interface DraftResponse {
    result: number; // mcpId
    code: string;
    message: string;
    timestamp: string;
}

// 파일 업로드 응답
// POST /files/{category} 응답
export interface FileUploadResponse {
    result: {
        url: string; // 업로드된 파일의 URL
    };
    message: string;
    timestamp: string;
    code: string;
}
