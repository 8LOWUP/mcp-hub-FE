// GET/POST /workspaces/mcps/token/{platformId}
import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";

export type McpTokenGetResult = {
    platformId: string;
    token: string;
};

export const getWorkspaceMcpToken = async (platformId: string): Promise<McpTokenGetResult> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        encodeURIComponent(platformId)
    );
    const res = await axiosInstance.get(url);
    return (res.data?.result ?? res.data) as McpTokenGetResult;
};

export const saveWorkspaceMcpToken = async (
    platformId: string,
    token: string
): Promise<{ platformId: string }> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN.replace(
        "{platformId}",
        encodeURIComponent(platformId)
    );
    const res = await axiosInstance.post(url, { token });
    return (res.data?.result ?? res.data) as { platformId: string };
};
