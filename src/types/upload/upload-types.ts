import { CommonResponse } from "@/types/common";

/* -------------------------------------------------------------------------- */
/* 📂 파일 업로드 관련 (Swagger: /files/presigned-url/{category})               */
/* -------------------------------------------------------------------------- */

/**
 * Presigned URL 요청용 파라미터
 * - 서버에 전달할 정보 (파일 이름만 전송)
 */
export interface PresignedUrlRequest {
    /** 업로드할 카테고리 */
    category: string;

    /** 업로드할 파일 이름 */
    fileName: string;
}

/**
 * 실제 파일 업로드 요청 (프론트 내부 로직용)
 * - Presigned URL 요청 + 실제 파일 객체 포함
 */
export interface FileUploadRequest {
    /** 업로드할 카테고리 */
    category: string;

    /** 실제 업로드할 파일 객체 */
    file: File;
}

/**
 * Presigned URL 응답 구조 (Swagger 예시 기반)
 */
export interface FileUploadResult {
    /** S3 업로드용 PreSigned URL */
    url: string;
}

/**
 * 최종 업로드 결과 응답
 */
export type FileUploadResponse = CommonResponse<FileUploadResult>;

/* -------------------------------------------------------------------------- */
/* 🧩 MCP 메타데이터 관련 (Swagger: /mcps/dashboard/meta, /mcps/dashboard/publish) */
/* -------------------------------------------------------------------------- */

/**
 * MCP의 개별 툴 정보 구조
 */
export interface McpTool {
    /** MCP 툴 이름 */
    name: string;

    /** MCP 툴 내용 */
    content: string;
}

/**
 * MCP 메타데이터 구조
 * - Swagger: McpUploadDataRequest 기반
 * - 실제 multipart/form-data 내 "meta" JSON 객체
 */
export interface McpMeta {
    /** MCP ID (수정/등록 대상 ID) */
    mcpId?: number;

    /** MCP 이름 */
    name?: string;

    /** MCP 설명 */
    description?: string;

    /** 카테고리 ID */
    categoryId?: number;

    /** 라이선스 ID */
    licenseId?: number;

    /** 소스 코드 / 참조 URL */
    sourceUrl?: string;

    /** 대표 이미지 URL */
    imageUrl?: string;

    /** 플랫폼 이름 */
    platformName?: string;

    /** 요청 URL (예: API 엔드포인트) */
    requestUrl?: string;

    /** 개발자 이름 */
    developerName?: string;

    /** 키가 필요한 MCP 여부 */
    isKeyRequired?: boolean;

    /** MCP 툴 리스트 */
    tools?: McpTool[];
}

/**
 * MCP 메타데이터 저장/배포 요청 구조
 * - 실제 전송 형태: multipart/form-data
 * - file(binary) + meta(JSON)
 */
export interface McpMetaRequestFormData {
    /** 업로드할 MCP 관련 파일 (binary) */
    file: File;
    meta: McpMeta;
}

/**
 * MCP 메타데이터 관련 응답 구조
 * - Swagger의 BaseResponseLong 기반
 */
export type McpMetaResponse = CommonResponse<number>;
