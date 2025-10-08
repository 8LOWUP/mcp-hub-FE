// src/types/upload/upload-types.ts
import { CommonResponse } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* 📂 파일 업로드 관련 (Swagger: /files/presigned-url/{category})               */
/* -------------------------------------------------------------------------- */

/**
 * Presigned URL 발급 요청 파라미터
 * - category: 파일 업로드 카테고리 (예: "mcp", "profile" 등)
 * - file: 업로드할 실제 파일 객체
 */
export interface FileUploadRequest {
    category: string;
    file: File;
}

/**
 * Presigned URL 응답 구조 (Swagger 예시 기반)
 * {
 *   "timestamp": "2025-10-08T12:10:10.886Z",
 *   "code": "SUCCESS",
 *   "message": "성공",
 *   "result": {
 *     "url": "https://s3.ap-northeast-2.amazonaws.com/bucket-name/file.png?..."
 *   }
 * }
 */
export interface FileUploadResult {
    /** Presigned S3 업로드 URL */
    url: string;
}

/**
 * S3 업로드 완료 후 프론트에서 사용하는 실제 업로드 결과 타입
 * (Presigned URL에서 '?' 이전 부분만 추출)
 */
export type FileUploadResponse = CommonResponse<FileUploadResult>;

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 메타데이터 관련                                                     */
/* -------------------------------------------------------------------------- */

/**
 * MCP의 Tool 상세 정보
 * - MCP 안에서 제공되는 개별 도구/명령어를 정의
 */
export interface McpTool {
    /** 도구 이름 */
    name: string;
    /** 도구 설명 */
    content: string;
}

/**
 * MCP 메타데이터 구조 (Swagger: /mcps/dashboard/meta & /publish)
 */
export interface McpMeta {
    /** MCP ID (신규일 경우 0) */
    mcpId: number;
    /** MCP 이름 */
    name: string;
    /** MCP 설명 */
    description: string;
    /** 카테고리 ID */
    categoryId: number;
    /** 라이선스 ID */
    licenseId: number;
    /** 소스코드 URL (GitHub 등) */
    sourceUrl: string;
    /** MCP 로고 / 대표 이미지 URL */
    imageUrl: string;
    /** 연결되는 플랫폼 이름 (예: Notion, Slack 등) */
    platformName: string;
    /** MCP 요청 URL (백엔드 API endpoint) */
    requestUrl: string;
    /** 개발자 이름 */
    developerName: string;
    /** API Key 필요 여부 */
    isKeyRequired: boolean;
    /** MCP에 포함된 도구 목록 */
    tools: McpTool[];
}

/**
 * MCP 메타데이터 저장/배포 요청 구조
 * - Swagger 기준: PATCH /mcps/dashboard/meta & /publish
 */
export interface McpMetaRequest {
    /** 파일 이름 (옵션, 현재 빈 문자열로 전달) */
    file: string;
    /** MCP 메타데이터 */
    meta: McpMeta;
}

/**
 * MCP 메타데이터 저장/배포 응답 구조
 * - 서버에서는 CommonResponse<number> 형태로 ID 반환
 */
export type McpMetaResponse = CommonResponse<number>;
