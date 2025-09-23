"use client";

import { useEffect, useState } from "react";
import {McpDetail, MOCK_MARKET_DATA} from "@/features/detail/hooks/constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import McpAbout from "@/features/detail/components/McpAbout";
import MarketTools from "@/features/detail/components/McpTool";
import MarketReviews from "@/features/detail/components/McpReview";
import McpUrlCopy from "@/features/detail/components/McpUrlCopy";
import MarketConnectionPlatforms from "@/features/detail/components/McpConntionPlatforms";
import McpDetails from "@/features/detail/components/McpDetails";
import McpHeader from "@/features/detail/components/McpHeader"
import { ReviewList } from "@/features/detail/components/ReviewCard";


interface PageProps {
    params: { id: string };
}

export default function MarketDetailPage({ params }: PageProps) {
    const { id } = params;
    const [data, setData] = useState<McpDetail>(MOCK_MARKET_DATA);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="flex pt-30 items-start justify-center">
            <main className="flex gap-x-8">
                <section className="flex flex-col gap-4 w-180">
                    <McpHeader data={data} />
                    <McpAbout about={data.about} />
                    <MarketTools tools={data.tools} />
                    <MarketReviews reviews={data.reviews} />
                    <ReviewList reviews={data.reviews} />
                </section>

                <aside className="flex flex-col gap-4 w-80">
                    <PrimaryButton>Go to Chat</PrimaryButton>
                    <McpUrlCopy url={data.url} />
                    <MarketConnectionPlatforms platforms={data.connectionPlatform} />
                    <McpDetails data={data} />
                </aside>
            </main>
        </div>
    );
}


