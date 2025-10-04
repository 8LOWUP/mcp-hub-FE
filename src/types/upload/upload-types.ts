// src/types/upload/upload-types.ts

import {CommonResponse} from "@/types/common";

/*파일 업로드*/

export interface FileUploadRequest {
    category: string;
    file: File;
}

export interface FileUploadResult {
    url: string;
}

export type FileUploadResponse = CommonResponse<FileUploadResult>;

/* mcp 메타 데이터 */

export interface McpTool {
    name: string;
    content: string;
}

export interface McpMeta {
    mcpId: number;
    name: string;
    description: string;
    categoryId: number;
    licenseId: number;
    sourceUrl: string;
    imageUrl: string;
    platformName: string;
    requestUrl: string;
    developerName: string;
    isKeyRequired: boolean;
    tools: McpTool[];
}

export interface McpMetaRequest {
    file: string;
    meta: McpMeta;
}

export type McpMetaResponse = CommonResponse<number>;
