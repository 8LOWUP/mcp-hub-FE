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
} from "@/types/detail/detail-types";


// ✅ MCP 리뷰 조회 훅 (페이지네이션 지원)

export const useMarketReviews = (
    mcpId: number,
    params: { page: number; size: number; sort?: string }
) => {
    return useQuery<getMcpReviewsResponse["result"]>({
        queryKey: ["mcpReviews", mcpId, params],
        queryFn: async () => {
            const finalParams = { ...params, sort: params.sort ?? "createdAt,desc" };
            const res = await getMcpReviews(mcpId, finalParams);
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

// ✅ MCP 리뷰 수정 훅

export const useUpdateReview = (reviewId: number, mcpId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: patchMcpReviewRequestBody) =>
            updateMcpReview(reviewId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};


// ✅ MCP 리뷰 삭제 훅

export const useDeleteReview = (reviewId: number, mcpId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteMcpReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcpReviews", mcpId] });
        },
    });
};
