// src/app/[locale]/detail/[id]/page.tsx
"use client";

import { use } from "react";
import { useRouter, usePathname } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import McpAbout from "@/features/detail/components/McpAbout";
import MarketTools from "@/features/detail/components/McpTool";
import McpUrlCopy from "@/features/detail/components/McpUrlCopy";
import McpDetails from "@/features/detail/components/McpDetails";
import McpHeader from "@/features/detail/components/McpHeader";
import ReviewList from "@/features/detail/components/ReviewList";
import ReviewForm from "@/features/detail/components/ReviewForm";
import { useMarketDetail } from "@/hooks/detail/useMarketDetail";
import { useMarketReviews } from "@/hooks/detail/useReview";
import { useLoginStore } from "@/store/login/login-store";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MarketDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname(); // ✅ 현재 경로 예: /ko/detail/12
    const locale = pathname.split("/")[1] || "en"; // ✅ locale 추출

    const mcpId = Number(id);

    const { data: detail, isLoading: loadingDetail, error } = useMarketDetail(mcpId);
    const { data: reviewData, isLoading: loadingReviews } = useMarketReviews(mcpId, {
        page: 0,
        size: 10,
        sort: "createdAt,DESC",
    });

    // ✅ 채팅 페이지로 이동
    const handleGoToChat = () => {
        router.push(`/${locale}/chat`); // 예: /ko/chat
    };

    if (loadingDetail) return <div className="pt-20 text-center">Loading...</div>;
    if (error || !detail) return <div className="pt-20 text-center">데이터 없음</div>;

    return (
        <div className="flex flex-col md:flex-row pt-20 md:pt-30 pb-10 items-start justify-center px-4 md:px-8 gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8">
                <section className="flex flex-col gap-4 md:w-4/6">
                    <McpHeader data={detail} />

                    <div className="block md:hidden">
                        <PrimaryButton
                            additionalClassName="w-full py-2 text-sm"
                            onClick={handleGoToChat}
                        >
                            Go to Chat
                        </PrimaryButton>
                    </div>

                    <McpAbout about={detail.description} />
                    <MarketTools data={detail} />

                    {loadingReviews ? (
                        <div className="text-center text-gray-400">리뷰 불러오는 중...</div>
                    ) : (
                        <ReviewList reviews={reviewData?.content ?? []} mcpId={mcpId} />
                    )}

                    {useLoginStore.getState().isLoggedIn ? (
                        reviewData?.content.some(r => r.mine) ? (
                            <p className="text-gray-400 text-sm">
                                이미 리뷰를 작성하셨습니다. 수정/삭제만 가능합니다.
                            </p>
                        ) : (
                            <ReviewForm mcpId={mcpId} />
                        )
                    ) : (
                        <p className="text-gray-400 text-sm">
                            로그인해야 리뷰를 작성할 수 있습니다.
                        </p>
                    )}
                </section>

                <aside className="flex flex-col gap-4 md:w-2/6">
                    <div className="md:mt-10 md:sticky md:top-30 flex flex-col gap-4">
                        <div className="hidden md:flex justify-center w-full">
                            <PrimaryButton
                                additionalClassName="w-full py-3 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
                                onClick={handleGoToChat}
                            >
                                Go to Chat
                            </PrimaryButton>
                        </div>

                        <McpUrlCopy url={detail.requestUrl ?? undefined} />
                        <McpDetails data={detail} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
