"use client";

import { useState } from "react";
import type { ReviewItem } from "@/types/detail/detail-types";
import ReviewCard from "./ReviewCard";
import { ChevronLeft, ChevronRight, MessageCircleHeart } from "lucide-react";

interface ReviewListProps {
    reviews: ReviewItem[];
    mcpId: number; // 🔑 mcpId 추가
}

const REVIEWS_PER_PAGE = 4;

export default function ReviewList({ reviews, mcpId }: ReviewListProps) {
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const start = page * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;
    const currentReviews = reviews.slice(start, end);

    const handlePrev = () => setPage((p) => (p > 0 ? p - 1 : p));
    const handleNext = () => setPage((p) => (p < totalPages - 1 ? p + 1 : p));

    return (
        <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
                <MessageCircleHeart className="w-5 h-5" />
                <span className="text-white font-bold text-xl tracking-tight">Reviews</span>
            </div>

            {/* ✅ 기존 border 카드 박스는 그대로 유지 */}
            <div className="rounded-2xl border border-contrast shadow-xl p-4">
                {/* ✅ 리뷰가 없을 때 표시 */}
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <MessageCircleHeart className="w-8 h-8 mb-2 opacity-60" />
                        <p className="text-center text-sm">아직 등록된 리뷰가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div
                            key={page}
                            className={`grid grid-cols-2 gap-4 animate-fade-in-up 
                ${currentReviews.length <= 2 ? "grid-rows-1" : "grid-rows-2"}`}
                        >
                            {currentReviews.map((r, i) => (
                                <div
                                    key={r.reviewId}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {/* 🔑 mcpId 넘겨주기 */}
                                    <ReviewCard review={r} mcpId={mcpId} />
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={handlePrev}
                                    disabled={page === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600/50 text-gray-300 hover:text-white hover:bg-accent hover:scale-110 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex gap-2 items-center">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <span
                                            key={i}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                i === page ? "bg-accent scale-110" : "bg-gray-600"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={page === totalPages - 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600/50 text-gray-300 hover:text-white hover:bg-accent hover:scale-110 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
