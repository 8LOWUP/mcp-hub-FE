// src/features/profiles/types/mcps.ts

/* 카드 컴포넌트가 기대하는 형태와 일치시킴 */
export type McpItemType = {
    id: string;              // ✅ UI는 string id 기대 → 문자열로 통일
    title: string;           // ✅ UI에서 title 사용 → name을 매핑해서 채움
    name: string;
    version: string;
    description: string;
    imageUrl: string;
    categoryName: string;
    platformName: string;
    licenseName: string;
    createdAt: string;
    apiKey?: string;         // ✅ API Key 모달에서 사용
};

export type PageRequestType = {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
};

export type PageResponseType<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};
