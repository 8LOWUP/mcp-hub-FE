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
        // 🔸 로그인되지 않은 경우 → 전역 로그인 모달 오픈
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }

        // 🔸 로그인된 사용자 → MCP 토큰 확인
        try {
            const res = await refetchToken();
            const result = res.data?.result;

            if (!result) throw new Error("No token check result");

            if (result.isTokenExist) {
                // ✅ 토큰 존재 → 채팅 페이지로 이동
                router.push(`/${locale}/chat`);
            } else {
                // ✅ 토큰 없음 → MCP 연결 모달 표시
                setPlatformId(result.platformId);
                setIsModalOpen(true);
            }
        } catch (err: any) {
            console.error("MCP Token check failed:", err);
            // ⚠️ 400 에러(유저가 저장하지 않은 MCP)도 동일하게 MCP 연결 모달 표시
            setIsModalOpen(true);
        }
    };

    // ✅ 로딩 / 에러 처리
    if (loadingDetail) return <div className="pt-20 text-center">Loading...</div>;
    if (error || !detail) return <div className="pt-20 text-center">데이터 없음</div>;

    return (
        <>
            {/* ✅ 본문 영역 */}
            <div className="flex flex-col md:flex-row pt-20 md:pt-30 pb-10 items-start justify-center px-4 md:px-8 gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8">
                    {/* 왼쪽 섹션 */}
                    <section className="flex flex-col gap-4 md:w-4/6">
                        <McpHeader data={detail} />

                        {/* ✅ 모바일용 Chat 버튼 */}
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

                        {/* ✅ 리뷰 섹션 */}
                        {loadingReviews ? (
                            <div className="text-center text-gray-400">리뷰 불러오는 중...</div>
                        ) : (
                            <ReviewList reviews={reviewData?.content ?? []} mcpId={mcpId} />
                        )}

                        {/* ✅ 리뷰 작성 가능 여부 */}
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

                    {/* ✅ 오른쪽 사이드 섹션 */}
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

            {/* ✅ MCP 연결 모달 */}
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
