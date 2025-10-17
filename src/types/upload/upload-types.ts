// //src/types/upload/upload-types.ts

import { CommonResponse } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* 📂 파일 업로드 관련 (Swagger: /files/presigned-url/{category})               */
/* -------------------------------------------------------------------------- */

export interface PresignedUrlRequest {
    category: string;
    fileName: string;
}

export interface FileUploadRequest {
    category: string;
    file: File;
}

export interface FileUploadResult {
    url: string;
}

export type FileUploadResponse = CommonResponse<FileUploadResult>;

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 메타데이터 관련 (Swagger: /mcps/dashboard/meta, /mcps/dashboard/publish) */
/* -------------------------------------------------------------------------- */

export interface McpTool {
    name: string;
    content: string;
}

export interface McpMeta {
    mcpId?: number;
    name?: string;
    description?: string;
    categoryId?: number;
    licenseId?: number;
    sourceUrl?: string;
    imageUrl?: string;
    platformName?: string;
    requestUrl?: string;
    developerName?: string;
    isKeyRequired?: boolean;
    tools?: McpTool[];
}

export interface McpMetaRequestFormData {
    file: File;
    meta: McpMeta;
}

export type McpMetaResponse = CommonResponse<number>;

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 상세 조회 관련 (Swagger: /mcps/dashboard/detail/{mcpId})                */
/* -------------------------------------------------------------------------- */

export interface MyMcpDetail {
    id: number;
    name: string;
    version?: string;
    description?: string;
    imageUrl?: string | null;
    requestUrl?: string | null;
    sourceUrl?: string | null;
    developerName?: string | null;
    isKeyRequired: boolean;
    categoryId: number;
    categoryName?: string;
    platformId?: number;
    platformName?: string;
    licenseId: number;
    licenseName?: string;
    published?: boolean;
    tools?: { id?: number; name: string; content: string }[];
}

export type MyMcpDetailResponse = CommonResponse<MyMcpDetail>;
