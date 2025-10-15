/** 목록 조회 쿼리 파라미터 */
export type UploadedMcpQueryType = {
    page?: number;   // 0-base
    size?: number;   // page size
    sort?: string;   // e.g. "publishedDate,desc"
    category?: string | number;
    search?: string;
};

/** 서버에서 내려오는 단일 아이템 */
export type UploadedMcpItemType = {
    id: number;
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

    /** ✅ 스웨거에 존재하는 필드 추가 */
    averageRating?: number;
    savedUserCount?: number;

    /** ✅ 배포 여부 관련 필드 (임시저장/배포 구분용) */
    published?: boolean;
    publishedDate?: string | null;     // ISO string
    lastPublishedAt?: string | null;   // ISO string
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
