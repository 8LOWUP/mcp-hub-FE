import { CommonResponse } from "../common";

// MCP 리스트 조회 리퀘스트 바디
type getMCPListRequestBody = {
    page: number;
    size: number;
    sort: string;
    category: string;
    search: string;
};

// MCP 리스트 조회 리스폰스
type McpListResponse = {
    totalPages: number;
    totalElements: number;
    size: number;
    content: {
        id: number;
        name: string;
        version: string;
        description: string;
        imageUrl: string;
        isKeyRequired: boolean;
        categoryName: string;
        platformName: string;
        licenseName: string;
        averageRating: number;
        savedUserCount: number;
        publishedDate: string;
    }[];
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    pageable: {
        offset: number;
        sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
        };
        paged: boolean;
        pageNumber: number;
        pageSize: number;
        unpaged: boolean;
    };
    first: boolean;
    last: boolean;
    empty: boolean;
};

// MCP 리스트 조회 리스폰스
type getMCPListReponse = CommonResponse<McpListResponse>