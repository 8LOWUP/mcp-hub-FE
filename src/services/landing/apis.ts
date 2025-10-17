import { API_ENDPOINTS } from "@/constants/apis/key";
import { serverAxios } from "@/lib/serverAxios";
import { getLandingMCPDataRequestBody, getLandingMCPDataResponse } from "@/types/landing/landingMCPDataType";


export const getLandingMCPData = async (data: getLandingMCPDataRequestBody): Promise<getLandingMCPDataResponse> => {
    const response = await serverAxios.get(API_ENDPOINTS.MCP.LIST, { params: data });
    return response.data;
};