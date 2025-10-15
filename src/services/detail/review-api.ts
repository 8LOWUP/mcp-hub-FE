import axiosInstance from "../AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type {
    getMcpReviewsRequest,
    getMcpReviewsResponse,
    postMcpReviewRequestBody,
    postMcpReviewResponse,
    patchMcpReviewRequestBody,
    patchMcpReviewResponse,
    deleteMcpReviewResponse,
} from "@/types/detail/detail-types";


// ✅ 리뷰 목록 조회
export const getMcpReviews = async (
    mcpId: number,
    params: getMcpReviewsRequest
): Promise<getMcpReviewsResponse> => {
    const url = API_ENDPOINTS.MCP.REVIEW.replace("{mcpId}", String(mcpId));
    console.log("📡 리뷰 목록 요청 URL:", url, "params:", params);

    const response = await axiosInstance.get<getMcpReviewsResponse>(url, {
        params,
    });

    console.log("✅ 리뷰 조회 응답:", response.data);
    return response.data;
};


// ✅ 리뷰 작성
export const createMcpReview = async (
    mcpId: number,
    data: Omit<postMcpReviewRequestBody, "userName">   // 🔥 userName 제거
): Promise<postMcpReviewResponse> => {
    const url = API_ENDPOINTS.MCP.REVIEW.replace("{mcpId}", String(mcpId));
    console.log("📡 리뷰 작성 요청 URL:", url, "body:", data);

    const response = await axiosInstance.post<postMcpReviewResponse>(url, data);

    console.log("✅ 리뷰 작성 응답:", response.data);
    return response.data;
};


// ✅ 리뷰 수정
export const updateMcpReview = async (
    reviewId: number,
    data: patchMcpReviewRequestBody
): Promise<patchMcpReviewResponse> => {
    const url = API_ENDPOINTS.MCP.REVIEW_DELETE.replace("{reviewId}", String(reviewId));
    console.log("📡 리뷰 수정 요청 URL:", url, "body:", data);

    const response = await axiosInstance.patch<patchMcpReviewResponse>(url, data);

    console.log("✅ 리뷰 수정 응답:", response.data);
    return response.data;
};


// ✅ 리뷰 삭제
export const deleteMcpReview = async (
    reviewId: number
): Promise<deleteMcpReviewResponse> => {
    const url = API_ENDPOINTS.MCP.REVIEW_DELETE.replace("{reviewId}", String(reviewId));
    console.log("📡 리뷰 삭제 요청 URL:", url);

    const response = await axiosInstance.delete<deleteMcpReviewResponse>(url);

    console.log("✅ 리뷰 삭제 응답:", response.data);
    return response.data;
};
