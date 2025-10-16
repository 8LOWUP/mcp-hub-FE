// GET/POST /workspaces/mcps/token/{platformId}
import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";

export type McpTokenGetResult = {
    platformId: string;
    token: string; // 항상 문자열로 보장
};

export const getWorkspaceMcpToken = async (platformId: string): Promise<McpTokenGetResult> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        encodeURIComponent(platformId)
    );
    const { data } = await axiosInstance.get(url);
    const raw = data?.result ?? data;

    return {
        platformId: String(raw?.platformId ?? platformId),
        token: typeof raw?.token === "string" ? raw.token : "", // ✅ 문자열 정규화
    };
};

export const saveWorkspaceMcpToken = async (
    platformId: string,
    token: string
): Promise<{ platformId: string }> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        encodeURIComponent(platformId)
    );
    // 서버가 { token } 바디를 기대한다고 가정
    const { data } = await axiosInstance.post(url, { token });
    return (data?.result ?? data) as { platformId: string };
};
