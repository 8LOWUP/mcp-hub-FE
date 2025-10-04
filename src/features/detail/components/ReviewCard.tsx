//src/features/detail/ReviewCard.tsx
"use client";

import { useState } from "react";
import type { ReviewItem } from "@/types/detail/detail-types";
import Image from "next/image";
import { Star, Pencil, Trash2, Check, X } from "lucide-react";
import { useUpdateReview, useDeleteReview } from "@/hooks/detail/useReview";

interface ReviewCardProps {
    review: ReviewItem;
    mcpId: number; // invalidateQueries 할 때 필요
}

export default function ReviewCard({ review, mcpId }: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(review.comment);
    const [editedRating, setEditedRating] = useState(review.rating);

    const updateReview = useUpdateReview(review.reviewId, mcpId);
    const deleteReview = useDeleteReview(review.reviewId, mcpId);

    // ✅ 리뷰 수정 저장
    // const handleUpdate = () => {
    //     updateReview.mutate(
    //         { rating: editedRating, comment: editedComment },
    //         {
    //             onSuccess: () => {
    //                 setIsEditing(false);
    //             },
    //         }
    //     );
    // };

    // ✅ 리뷰 삭제
    const handleDelete = () => {
        if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
            deleteReview.mutate();
        }
    };

    return (
        <div className="border border-[#414141] bg-[#2C2C2C] text-white p-4 rounded-xl shadow-md flex gap-3 transition-all duration-500 ease-out animate-fade-in-up">
            {/* 프로필 */}
            <div className="w-8 h-8 flex-shrink-0 rounded-full border border-accent-color-1 overflow-hidden">
                <Image
                    src="/catprofile.svg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* 내용 */}
            <div className="flex flex-col flex-1">
                {/* 상단: 닉네임 + 작성일 */}
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                    <span className="font-medium text-white">
                        {review.userName ?? "Anonymous"}
                    </span>
                    <span>
                        {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                    </span>
                </div>

                {/* 별점 */}
                <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className={`cursor-pointer ${
                                i < (isEditing ? editedRating : review.rating)
                                    ? "text-yellow-400 drop-shadow-sm fill-current"
                                    : "text-gray-600"
                            }`}
                            onClick={() => isEditing && setEditedRating(i + 1)}
                        />
                    ))}
                </div>

                {/* 리뷰 내용 */}
                {isEditing ? (
                    <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className="w-full p-2 rounded-md bg-[#1e1e1e] border border-gray-600 text-sm"
                    />
                ) : (
                    <p className="text-gray-100 text-sm leading-relaxed">
                        {review.comment}
                    </p>
                )}

                {/* ✅ 수정/삭제 버튼 (본인 리뷰일 경우에만 노출) */}
                {review.mine && (
                    <div className="flex gap-2 mt-2">
                        {isEditing ? (
                            <>
                                <button
                                    //onClick={handleUpdate}
                                    className="flex items-center gap-1 text-green-400 text-xs"
                                >
                                    <Check size={14} /> 저장
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-1 text-gray-400 text-xs"
                                >
                                    <X size={14} /> 취소
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1 text-blue-400 text-xs"
                                >
                                    <Pencil size={14} /> 수정
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1 text-red-400 text-xs"
                                >
                                    <Trash2 size={14} /> 삭제
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
