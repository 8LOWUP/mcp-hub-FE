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
import {useLoginStore} from "@/store/login/login-store";

// ✅ MCP 리뷰 조회 훅 (mine 재계산 포함)
export const useMarketReviews = (
    mcpId: number,
    params: { page: number; size: number; sort?: string }
) => {
    return useQuery<getMcpReviewsResponse["result"]>({
        queryKey: ["mcpReviews", mcpId, params],
        queryFn: async () => {
            const finalParams = { ...params, sort: params.sort ?? "createdAt,desc" };
            const res = await getMcpReviews(mcpId, finalParams);

            // ✅ 서버에서 내려준 mine 그대로 사용
            return res.result;
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
        mutationFn: (data: postMcpReviewRequestBody) =>
            createMcpReview(mcpId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};

// ✅ 리뷰 수정
export const useUpdateReview = (mcpId: number, reviewId: number) => {
    const queryClient = useQueryClient();

    return useMutation<patchMcpReviewResponse, Error, patchMcpReviewRequestBody>({
        mutationFn: (data) => updateMcpReview(reviewId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};

// ✅ 리뷰 삭제
export const useDeleteReview = (mcpId: number, reviewId: number) => {
    const queryClient = useQueryClient();

    return useMutation<deleteMcpReviewResponse, Error, void>({
        mutationFn: () => deleteMcpReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};
