import { axiosInstance } from "@/services/AxiosInstance";

/** 자동완성에서 쓸 최소 스키마 */
export type McpAutoCompleteItem = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
};

/** 서버 공통 래핑(BaseResponse) */
type BaseResponse<T> = {
    code: string;
    message: string;
    result: T;
};

type PageMcp = {
    content: McpAutoCompleteItem[];
    totalElements: number;
    totalPages: number;
    number: number; // 0-base
    size: number;
};

export const getMcpAutoComplete = async (q: string, size = 8) => {
    if (!q.trim()) return [] as McpAutoCompleteItem[];
    const { data } = await axiosInstance.get<BaseResponse<PageMcp>>("/mcps", {
        params: {
            search: q,
            page: 0,
            size,
            sort: "popular",
        },
    });
    return data.result?.content ?? [];
};
