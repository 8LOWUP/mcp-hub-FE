"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMcpReviews,
    createMcpReview,
    updateMcpReview,
    deleteMcpReview,
} from "@/services/detail/review-api";
import type {
    getMcpReviewsResponse,
    postMcpReviewRequestBody,
    patchMcpReviewRequestBody,
    patchMcpReviewResponse,
    deleteMcpReviewResponse,
} from "@/types/detail/detail-types";

//
// ✅ MCP 리뷰 조회 훅
//
export const useMarketReviews = (
    mcpId: number,
    params: { page: number; size: number; sort?: string }
) => {
    return useQuery<getMcpReviewsResponse["result"]>({
        queryKey: ["mcpReviews", mcpId, params],
        queryFn: async () => {
            const finalParams = { ...params, sort: params.sort ?? "createdAt,desc" };

            try {
                const res = await getMcpReviews(mcpId, finalParams);
                return res.result;
            } catch (error: any) {
                // 🧭 Axios 에러 구분용 로그
                console.group("🧭 [useMarketReviews] Axios Error Debug");
                console.log("message:", error?.message);
                console.log("code:", error?.code);
                console.log("response:", error?.response);
                // 🔸 undefined면 Network/CORS 문제
                // 🔸 status 500이면 서버 내부 오류
                // 🔸 status 401이면 인증 문제
                console.groupEnd();

                // 에러를 react-query로 다시 던짐 (기존 로직 유지)
                throw error;
            }
        },
        enabled: !!mcpId,
    });
};

//
// ✅ MCP 리뷰 작성 훅
//
export const useCreateReview = (mcpId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: postMcpReviewRequestBody) => {
            try {
                return await createMcpReview(mcpId, data);
            } catch (error: any) {
                console.group("🧭 [useCreateReview] Axios Error Debug");
                console.log("message:", error?.message);
                console.log("code:", error?.code);
                console.log("response:", error?.response);
                console.groupEnd();
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};

//
// ✅ 리뷰 수정 훅
//
export const useUpdateReview = (mcpId: number, reviewId: number) => {
    const queryClient = useQueryClient();

    return useMutation<patchMcpReviewResponse, Error, patchMcpReviewRequestBody>({
        mutationFn: async (data) => {
            try {
                return await updateMcpReview(reviewId, data);
            } catch (error: any) {
                console.group("🧭 [useUpdateReview] Axios Error Debug");
                console.log("message:", error?.message);
                console.log("code:", error?.code);
                console.log("response:", error?.response);
                console.groupEnd();
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};

//
// ✅ 리뷰 삭제 훅
//
export const useDeleteReview = (mcpId: number, reviewId: number) => {
    const queryClient = useQueryClient();

    return useMutation<deleteMcpReviewResponse, Error, void>({
        mutationFn: async () => {
            try {
                return await deleteMcpReview(reviewId);
            } catch (error: any) {
                console.group("🧭 [useDeleteReview] Axios Error Debug");
                console.log("message:", error?.message);
                console.log("code:", error?.code);
                console.log("response:", error?.response);
                console.groupEnd();
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};
