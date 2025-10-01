"use client";

import { use } from "react";
import { Review } from "@/types/detail/detail-types";
import { useMarketDetail } from "@/hooks/detail/useMarketDetail";
import PrimaryButton from "@/components/ui/PrimaryButton";
import McpAbout from "@/features/detail/components/McpAbout";
import MarketTools from "@/features/detail/components/McpTool";
import McpUrlCopy from "@/features/detail/components/McpUrlCopy";
import MarketConnectionPlatforms from "@/features/detail/components/McpConntionPlatforms";
import McpDetails from "@/features/detail/components/McpDetails";
import McpHeader from "@/features/detail/components/McpHeader";
import ReviewList from "@/features/detail/components/ReviewList";
import ReviewForm from "@/features/detail/components/ReviewForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MarketDetailPage({ params }: PageProps) {
    const { id } = use(params);

    const { data, setData, loading } = useMarketDetail(id);

    const handleAddReview = (review: Review) => {
        setData((prev) =>
            prev ? { ...prev, reviews: [review, ...(prev.reviews ?? [])] } : prev
        );
    };

    if (loading) return <div className="pt-20 text-center">Loading...</div>;
    if (!data) return <div className="pt-20 text-center">데이터 없음</div>;

    return (
        <div className="flex flex-col md:flex-row pt-20 md:pt-30 pb-10 items-start justify-center px-4 md:px-8 gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8">
                <section className="flex flex-col gap-4 md:w-4/6">
                    <McpHeader data={data} />

                    <div className="block md:hidden">
                        <PrimaryButton additionalClassName="w-full py-2 text-sm">
                            Go to Chat
                        </PrimaryButton>
                    </div>

                    <McpAbout about={data.about ?? data.description} />
                    {data.tools?.length > 0 && <MarketTools tools={data.tools} />}
                    <ReviewList reviews={data.reviews ?? []} />
                    <ReviewForm onAddReview={handleAddReview} />
                </section>

                <aside className="flex flex-col gap-4 md:w-2/6">
                    <div className="md:mt-10 md:sticky md:top-24 flex flex-col gap-4">
                        <div className="hidden md:flex justify-center w-full">
                            <PrimaryButton additionalClassName="w-full py-3 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full">
                                Go to Chat
                            </PrimaryButton>
                        </div>
                        <McpUrlCopy url={data.url ?? data.requestUrl} />
                        <MarketConnectionPlatforms
                            platforms={data.connectionPlatform ?? []}
                        />
                        <McpDetails data={data} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
