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
import SaveMcpButton from "@/features/detail/components/SaveMcpButton";

// ✅ [1] usePostMcpToken 훅 추가 import
import { usePostMcpToken } from "@/hooks/detail/useMcpToken";

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";

    const mcpId = Number(id);

    const { data: detail, isLoading: loadingDetail, error } = useMarketDetail(mcpId);
    const { data: reviewData, isLoading: loadingReviews } = useMarketReviews(mcpId, {
        page: 0,
        size: 10,
        sort: "createdAt,DESC",
    });

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [platformId, setPlatformId] = React.useState("");

    const { isLoggedIn } = useLoginStore();
    const { open: openLoginModal } = useLoginModalStore();

    const { refetch: refetchToken } = useCheckMcpToken(mcpId);

    // ✅ [2] MCP 토큰 등록 훅 준비
    const { mutateAsync: postToken } = usePostMcpToken();

    /**
     * ✅ Go to Chat 클릭 시 처리
     * - 로그인 안 되어 있으면 로그인 모달
     * - 이미 토큰 있음 → 바로 채팅 이동
     * - 토큰 없음 → 모달에서 API Key 등록
     */
    const handleGoToChat = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }

        try {
            const res = await refetchToken();
            const result = res.data?.result;

            if (!result) throw new Error("No token check result");

            // ✅ 이미 토큰 존재 → 바로 이동
            if (result.isTokenExist) {
                router.push(`/${locale}/chat`);
                return;
            }

            // ✅ 토큰 없을 때: platformId 저장 후 모달 열기
            setPlatformId(result.platformId);
            setIsModalOpen(true);
        } catch (err: any) {
            console.error("MCP Token check failed:", err);
            setIsModalOpen(true);
        }
    };

    /**
     * ✅ [3] MCP 연결 완료 시 처리
     * - 모달에서 토큰 등록 성공 시 자동 이동
     */
    const handleConnected = async () => {
        try {
            // 🔹 토큰 등록 후 재확인 (선택사항이지만 안정적)
            const check = await refetchToken();
            if (check.data?.result.isTokenExist) {
                router.push(`/${locale}/chat`);
            }
        } catch {
            router.push(`/${locale}/chat`);
        } finally {
            setIsModalOpen(false);
        }
    };

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
                            {/* ✅ MCP 저장 버튼 */}
                            {isLoggedIn && (
                                <SaveMcpButton
                                    mcpId={mcpId}
                                    alreadySaved={detail.alreadySaved}
                                />
                            )}

                            {/* ✅ 채팅 이동 버튼 */}
                            <PrimaryButton
                                additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
                                onClick={handleGoToChat}
                            >
                                Go to Chat
                            </PrimaryButton>

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
                onConnected={handleConnected} // 🔹 수정 포인트: 콜백 연결
                mcpName={detail.name}
                platformId={platformId}
            />
        </>
    );
}
