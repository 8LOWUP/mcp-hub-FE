// 서버 응답 전용 타입(숫자 id). UI용 McpItemType 과 섞지 마세요.

/** 목록 조회 쿼리 파라미터 */
export type UploadedMcpQueryType = {
    page?: number;   // 0-base
    size?: number;   // page size
    sort?: string;   // e.g. "publishedDate,desc"
    category?: string;
    search?: string;
};

/** 서버에서 내려오는 단일 아이템 */
export type UploadedMcpItemType = {
    id: number;              // ✅ 서버는 숫자 id
    name: string;
    description?: string;
    imageUrl?: string;
    requestUrl?: string;
    sourceUrl?: string;
    developerName?: string;
    categoryId?: number;
    categoryName?: string;
    platformId?: number;
    platformName?: string;
    licenseId?: number;
    licenseName?: string;
    published?: boolean;
};

/** 페이지네이션 응답 */
export type UploadedMcpPageType = {
    content: UploadedMcpItemType[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
};
