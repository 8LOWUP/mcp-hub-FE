"use client";

import { useState } from "react";
import {SendIcon, Star} from "lucide-react";
import { Review } from "@/features/detail/hooks/types";

interface ReviewFormProps {
    onAddReview: (review: Review) => void;
}

export default function ReviewForm({ onAddReview }: ReviewFormProps) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newReview: Review = {
            id: Date.now().toString(),
            author: author || "Anonymous",
            content,
            rating,
            createdAt: new Date().toISOString().split("T")[0],
        };

        onAddReview(newReview);

        // 초기화
        setAuthor("");
        setContent("");
        setRating(0);
        setHoveredRating(0);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 mt-5 border border-contrast shadow-xl hover:shadow-2xl transition-all duration-300 bg-surface-2"
        >
            <h3 className="text-primary font-semibold mb-6 text-xl tracking-tight text-center">
                Give Feedback on MCP
            </h3>

            {/* 별점 */}
            <div className="flex items-center justify-center gap-3 mb-6">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform duration-200 ease-out hover:scale-125 active:scale-90"
                    >
                        <Star
                            size={28}
                            className={`transition-colors duration-200 ${
                                star <= (hoveredRating || rating)
                                    ? "text-yellow-400 drop-shadow-lg fill-current"
                                    : "text-gray-600 hover:text-gray-500"
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* 리뷰 내용 */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience..."
                className="p-3 mb-6 rounded-xl bg-surface-1 border border-contrast text-primary placeholder-muted min-h-[140px] resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 w-full"
            />

            {/* 작성자 이름 */}
            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="p-3 mb-6 rounded-xl bg-surface-1 border border-contrast text-primary placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent w-full transition-all duration-200"
            />

            {/* 제출 버튼 */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-surface-1 hover:bg-accent hover:text-black px-3 py-2 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <SendIcon className="w-4 h-3" /> Submit Review
                </button>

            </div>
        </form>

    );
}
