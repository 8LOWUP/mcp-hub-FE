"use client";

import { use } from "react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

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
import { useLoginModalStore } from "@/store/login/login-modal-store";
import { useCheckMcpToken } from "@/hooks/detail/useMcpToken";
import McpConnectModal from "@/features/detail/components/modal/McpConnectModal";

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";

    const mcpId = Number(id);

    // ✅ 데이터 로드
    const { data: detail, isLoading: loadingDetail, error } = useMarketDetail(mcpId);
    const { data: reviewData, isLoading: loadingReviews } = useMarketReviews(mcpId, {
        page: 0,
        size: 10,
        sort: "createdAt,DESC",
    });

    // ✅ 콘솔 출력 (백엔드 응답 확인용)
    React.useEffect(() => {
        if (detail) {
            console.group("🛰️ MCP 상세 데이터 (백엔드 응답)");
            console.log("📦 전체 detail 객체:", detail);
            console.table({
                id: detail.id,
                name: detail.name,
                version: detail.version,
                description: detail.description,
                requestUrl: detail.requestUrl,
                sourceUrl: detail.sourceUrl,
                imageUrl: detail.imageUrl,
                isKeyRequired: detail.isKeyRequired,
                developerName: detail.developerName,
                categoryName: detail.categoryName,
                platformName: detail.platformName,
                licenseName: detail.licenseName,
                averageRating: detail.averageRating,
                savedUserCount: detail.savedUserCount,
                publishDate: detail.publishDate,
                lastPublishDate: detail.lastPublishDate,
            });
            console.log("🧰 Tools 목록:", detail.tools);
            console.groupEnd();
        }
    }, [detail]);

    // ✅ 모달 상태
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [platformId, setPlatformId] = React.useState("");

    // ✅ 로그인 상태 및 로그인 모달 store
    const { isLoggedIn } = useLoginStore();
    const { open: openLoginModal } = useLoginModalStore();

    // ✅ MCP Token 확인 훅
    const { refetch: refetchToken } = useCheckMcpToken(mcpId);

    // ✅ Go to Chat 클릭 시 동작
    const handleGoToChat = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }

        try {
            const res = await refetchToken();
            const result = res.data?.result;

            if (!result) throw new Error("No token check result");

            if (result.isTokenExist) {
                router.push(`/${locale}/chat`);
            } else {
                setPlatformId(result.platformId);
                setIsModalOpen(true);
            }
        } catch (err: any) {
            console.error("MCP Token check failed:", err);
            setIsModalOpen(true);
        }
    };

    // ✅ 로딩 / 에러 처리
    if (loadingDetail) return <div className="pt-20 text-center">Loading...</div>;
    if (error || !detail) return <div className="pt-20 text-center">데이터 없음</div>;

    return (
        <>
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

                        {isLoggedIn ? (
                            reviewData?.content.some((r) => r.mine) ? (
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
                                    additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
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

            <McpConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConnected={() => router.push(`/${locale}/chat`)}
                mcpName={detail.name}
                platformId={platformId}
            />
        </>
    );
}
