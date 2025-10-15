// GET /workspaces/mcps/token/check/{mcpId}
import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";

export type McpCheckResult = {
    platformId: string;
    isTokenExist: boolean;
};

export const checkWorkspaceMcpToken = async (mcpId: number): Promise<McpCheckResult> => {
    const url = API_ENDPOINTS.WORKSPACES.MCPS_TOKEN_CHECK.replace(
        "{mcpId}",
        encodeURIComponent(String(mcpId))
    );
    const res = await axiosInstance.get(url);
    return res.data?.result as McpCheckResult;
};
