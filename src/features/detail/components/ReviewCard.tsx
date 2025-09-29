// "use client";
//
// import { Review } from "@/features/detail/hooks/types";
// import Image from "next/image";
//
// interface ReviewCardProps {
//     review: Review;
// }
//
// export default function ReviewCard({ review }: ReviewCardProps) {
//     return (
//         <div className="border border-[#414141] text-white p-4 rounded-[12px] shadow-md flex flex-col gap-2">
//             <div className="flex justify-between items-center text-sm text-gray-400">
//                 <div className="w-8 h-8 mx-1 rounded-full border border-accent-color-1 overflow-hidden">
//                     <Image
//                         src="/catprofile.svg"
//                         alt="Profile"
//                         width={32}
//                         height={32}
//                         className="object-cover w-full h-full"
//                     />
//                 </div>
//                 <span>{review.author}</span>
//                 <span>{review.createdAt}</span>
//             </div>
//             <div className="flex gap-1 text-yellow-400">
//                 {Array.from({ length: review.rating }, (_, i) => (
//                     <span key={i}>★</span>
//                 ))}
//                 {Array.from({ length: 5 - review.rating }, (_, i) => (
//                     <span key={i} className="text-gray-500">★</span>
//                 ))}
//             </div>
//             <p className="text-gray-100">{review.content}</p>
//         </div>
//     );
// }

"use client";

import { Review } from "@/features/detail/hooks/types";
import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="border border-[#414141] bg-[#2C2C2C] text-white p-4 rounded-xl shadow-md flex gap-3 transition-all duration-500 ease-out animate-fade-in-up">
            {/* 왼쪽 프로필 (작게) */}
            <div className="w-8 h-8 flex-shrink-0 rounded-full border border-accent-color-1 overflow-hidden">
                <Image
                    src="/catprofile.svg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* 오른쪽 정보 */}
            <div className="flex flex-col flex-1">
                {/* 상단: 이름(좌) + 날짜(우) */}
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                    <span className="font-medium text-white">{review.author}</span>
                    <span>{review.createdAt}</span>
                </div>

                {/* 별점 (작게) */}
                <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className={`${
                                i < review.rating
                                    ? "text-yellow-400 drop-shadow-sm fill-current"
                                    : "text-gray-600"
                            }`}
                        />
                    ))}
                </div>

                {/* 리뷰 내용 */}
                <p className="text-gray-100 text-sm leading-relaxed">
                    {review.content}
                </p>
            </div>
        </div>
    );
}


