// src/types/detail/detail-types.ts

import { CommonResponse } from "../common";

// ✅ MCP 상세 조회 (GET /mcps/{mcpId})
export type getMcpDetailResponse = CommonResponse<{
    id: number;
    name: string;
    version: string;
    description: string;
    requestUrl?: string | null;
    sourceUrl?: string | null;
    imageUrl?: string;
    isKeyRequired: boolean;
    developerName?: string | null;
    categoryName: string;
    platformName: string;
    licenseName: string;
    averageRating?: number | null;
    savedUserCount?: number | null;

    // ✅ tools: 객체 배열로 수정
    tools: {
        id: number;
        name: string;
        content: string;
    }[];

    publishDate?: string | null;
    lastPublishDate?: string | null;
}>;

// ✅ 리뷰 조회 (GET /mcps/review/{mcpId})
export type getMcpReviewsRequest = {
    page: number;
    size: number;
    sort: string;
};

export type ReviewItem = {
    reviewId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    mine: boolean;
};

export type PageSort = {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
};

export type Pageable = {
    offset: number;
    sort: PageSort;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
};

export type getMcpReviewsResponse = CommonResponse<{
    totalPages: number;
    totalElements: number;
    size: number;
    content: ReviewItem[];
    number: number;
    sort: PageSort;
    numberOfElements: number;
    pageable: Pageable;
    first: boolean;
    last: boolean;
    empty: boolean;
}>;

// ✅ 리뷰 작성 (POST /mcps/review/{mcpId})
export type postMcpReviewRequestBody = {
    userName?: string; // ✅ 백엔드 수정 후 삭제 예정 - 리뷰 이름
    rating: number;
    comment: string;
};

export type postMcpReviewResponse = CommonResponse<number>; // result = reviewId

// ✅ 리뷰 수정 (PATCH /mcps/review/{reviewId})
export type patchMcpReviewRequestBody = {
    userName: string;
    rating: number;
    comment: string;
};

export type patchMcpReviewResponse = CommonResponse<number>; // result = reviewId

// ✅ 리뷰 삭제 (DELETE /mcps/review/{reviewId})
export type deleteMcpReviewResponse = CommonResponse<number>; // result = reviewId
