import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";

export type MyMcpDetail = {
    id: number;
    name: string;
    version: string;
    description: string;
    imageUrl?: string | null;
    requestUrl?: string | null;
    sourceUrl?: string | null;
    developerName?: string | null;
    isKeyRequired: boolean;
    categoryId: number;
    categoryName: string;
    platformId: number;
    platformName: string;
    licenseId: number;
    licenseName: string;
    published: boolean;
    tools?: { id?: number; name: string; content: string }[];
};

export type MyMcpDetailResponse = {
    timestamp: string;
    code: string;
    message: string;
    result: MyMcpDetail;
};

const isOk = (c?: string) => c === "SUCCESS" || c === "COMMON200" || c === "200";

export const fetchMyUploadDetail = async (mcpId: number) => {
    const { data } = await axiosInstance.get<MyMcpDetailResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_DETAIL.replace("{mcpId}", String(mcpId))
    );
    if (!isOk(data.code)) throw new Error(data.message || "상세 조회 실패");
    return data.result;
};
