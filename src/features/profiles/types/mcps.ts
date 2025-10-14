/* 카드 컴포넌트(및 훅/서비스)에서 공통으로 기대하는 형태 */
export type McpItemType = {
    /** FE 카드용 문자열 id (UI 클릭/키로 사용) */
    id: string;
    /** 서버 숫자 id (API 호출용) */
    mcpId: number;

    /** UI 표기용 */
    title: string;

    /** 부가정보: 화면에 따라 있을 수도/없을 수도 있으니 옵셔널 처리 */
    name?: string;
    version?: string;
    description?: string;
    imageUrl?: string;
    categoryName?: string;
    platformName?: string;
    licenseName?: string;
    createdAt?: string;
    apiKey?: string;
    published?: boolean;
};

/* 페이지 요청/응답 공통 타입 */
export type PageRequestType = {
    page?: number;   // 0-base
    size?: number;
    search?: string;
    sort?: string;
};

export type PageResponseType<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // 현재 페이지(0-base)
    size: number;
    /** 아래 3개는 서버에서 안 줄 수 있으니 옵셔널로 */
    first?: boolean;
    last?: boolean;
    empty?: boolean;
};
