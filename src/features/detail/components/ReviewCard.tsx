//src/features/detail/components/ReviewCard.tsx
import React from "react";
import { PiStarFill, PiStarBold } from "react-icons/pi";
import { Review } from "@/features/detail/hooks/types";

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <div className="bg-[#2C2C2C] p-4 mb-4 shadow-md rounded-[12px]">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{review.author}</h4>
                <p className="text-gray-400 text-sm">{review.createdAt}</p>
            </div>
            <div className="flex space-x-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) =>
                    idx < review.rating ? (
                        <PiStarFill key={idx} className="w-5 h-5" />
                    ) : (
                        <PiStarBold key={idx} className="w-5 h-5" />
                    )
                )}
            </div>
            <p className="text-gray-200 mb-2 break-words">{review.content}</p>
        </div>
    );
};

export const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    return (
        <div className="max-w-2xl mx-auto">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
};

