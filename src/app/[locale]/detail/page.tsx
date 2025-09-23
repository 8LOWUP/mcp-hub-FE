"use client";

import { useEffect, useState } from "react";
import {McpDetail, MOCK_MARKET_DATA} from "@/features/detail/hooks/constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import McpAbout from "@/features/detail/components/McpAbout";
import MarketTools from "@/features/detail/components/McpTool";
import McpUrlCopy from "@/features/detail/components/McpUrlCopy";
import MarketConnectionPlatforms from "@/features/detail/components/McpConntionPlatforms";
import McpDetails from "@/features/detail/components/McpDetails";
import McpHeader from "@/features/detail/components/McpHeader"
import ReviewList from "@/features/detail/components/ReviewList";
import ReviewForm from "@/features/detail/components/ReviewForm";
import {Review} from "@/features/detail/hooks/types";

interface PageProps {
    params: { id: string };
}

export default function MarketDetailPage({ params }: PageProps) {
    const { id } = params;
    const [data, setData] = useState<McpDetail>(MOCK_MARKET_DATA);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        if (!id) return;
        setLoading(true);

        async function fetchData() {
            try {
                const res = await fetch(`/api/market/${id}`);
                if (!res.ok) throw new Error("Fetch failed");
                const result: McpDetail = await res.json();
                setData(result);
            } catch (error) {
                console.error("Fetch failed, using mock data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return <div className="pt-20 text-center">Loading...</div>;
    const handleAddReview = (review: Review) => {
        setData((prev) => ({ ...prev, reviews: [review, ...prev.reviews] }));
    };
    return (

        <div className="flex flex-col md:flex-row pt-20 md:pt-30 pb-10 items-start justify-center px-4 md:px-8 gap-6 md:gap-8">
            <main className="flex flex-col md:flex-row w-full max-w-6xl gap-6 md:gap-8">
                {/* 메인 컨텐츠 영역 */}
                <section className="flex flex-col gap-4 md:w-4/6">
                    <McpHeader data={data} />

                    {/* 모바일 전용 Go to Chat 버튼 */}
                    <div className="block md:hidden">
                        <PrimaryButton className="w-full py-2 text-sm">Go to Chat</PrimaryButton>
                    </div>

                    <McpAbout about={data.about} />
                    <MarketTools tools={data.tools} />
                    <ReviewList reviews={data.reviews} />
                    <ReviewForm onAddReview={handleAddReview} />
                </section>

                {/* 사이드바 */}
                <aside className="flex flex-col gap-4 md:w-2/6">
                    {/* 데스크탑에서만 margin-top 추가 */}
                    <div className="md:mt-10 md:sticky md:top-24 flex flex-col gap-4">
                        {/* 데스크탑 전용 Go to Chat 버튼 */}
                        <div className="hidden md:flex justify-center w-full">
                            <PrimaryButton className="w-full py-3 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full">
                                Go to Chat
                            </PrimaryButton>
                        </div>

                        <McpUrlCopy url={data.url} />
                        <MarketConnectionPlatforms platforms={data.connectionPlatform} />
                        <McpDetails data={data} />
                    </div>
                </aside>
            </main>
        </div>

    );
}


