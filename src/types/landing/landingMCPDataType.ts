import { CommonResponse } from "../common";

// MCP 아이템 타입
export type MCPItem = {
    id: number;
    name: string;
    version: string;
    description: string;
    imageUrl: string | null;
    isKeyRequired: boolean;
    categoryName: string;
    platformName: string;
    licenseName: string;
    developerName: string;
    averageRating: number | null;
    savedUserCount: number;
    publishedDate: string;
};

// 페이지네이션 정보 타입
export type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
};

// 정렬 정보 타입
export type Sort = {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
};

// API 응답 결과 타입
export type LandingMCPDataResult = {
    content: MCPItem[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
};

// API 응답 바디 타입
export type getLandingMCPDataResponse = CommonResponse<LandingMCPDataResult>;

// API 요청 바디 타입
export type getLandingMCPDataRequestBody = {
    "page": number; // 0 부터 시작
    "size": number; // 1부터 시작
    "sort": string; // "popular", "rating"
    "category": number; // 1: web_server, 2: memory, 3: browser, 4: language, 5: etc
    "search": string; // 검색어
};