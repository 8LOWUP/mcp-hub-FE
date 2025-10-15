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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postMcpSave } from "@/services/detail/mcp-saved-api";
import { getMcpDetail } from "@/services/detail/mpc-api"; // ✅ 추가
import { usePostMcpToken } from "@/hooks/detail/useMcpToken";

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";

    const mcpId = Number(id);

    const { data: detail, isLoading: loadingDetail, error, refetch } = useMarketDetail(mcpId);
    const { data: reviewData, isLoading: loadingReviews } = useMarketReviews(mcpId, {
        page: 0,
        size: 10,
        sort: "createdAt,DESC",
    });

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [platformId, setPlatformId] = React.useState("");
    const [isSaved, setIsSaved] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const { isLoggedIn } = useLoginStore();
    const { open: openLoginModal } = useLoginModalStore();

    const { refetch: refetchToken } = useCheckMcpToken(mcpId);
    const { mutateAsync: postToken } = usePostMcpToken();

    React.useEffect(() => {
        if (detail?.alreadySaved) {
            setIsSaved(true);
        }
    }, [detail]);

    /** ✅ MCP 저장 요청 */
    const handleSave = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }

        try {
            setIsSaving(true);
            const res = await postMcpSave(mcpId);

            if (res.code === "SUCCESS" || res.result) {
                toast.success("✅ MCP가 성공적으로 저장되었습니다!");
                setIsSaved(true);

                // ✅ 저장 직후 상세 데이터 재조회
                console.log("🔄 MCP 저장 후 상세 정보 재요청 중...");
                const detailRes = await getMcpDetail(mcpId);
                console.log("📦 최신 MCP 상세 데이터:", detailRes);

                // ✅ react-query 캐시 갱신 (있을 경우)
                await refetch();
            } else {
                toast.error("⚠️ MCP 저장 실패. 다시 시도해주세요.");
            }
        } catch (err: any) {
            if (err.response?.status === 402) {
                toast.error("⚠️ 발행되지 않은 MCP입니다.");
            } else if (err.response?.status === 400) {
                toast.error("⚠️ 잘못된 요청입니다.");
            } else {
                toast.error("❌ MCP 저장에 실패했습니다.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    /** ✅ Go to Chat 클릭 시 처리 */
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
                return;
            }

            setPlatformId(result.platformId);
            setIsModalOpen(true);
        } catch (err: any) {
            console.error("MCP Token check failed:", err);
            setIsModalOpen(true);
        }
    };

    /** ✅ MCP 연결 완료 시 처리 */
    const handleConnected = async () => {
        try {
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
                        <McpHeader data={detail} isSaved={isSaved} />

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
                            {/* ✅ 로그인 여부 분기 처리 */}
                            {!isLoggedIn ? (
                                <PrimaryButton
                                    disabled
                                    additionalClassName="
                                        w-full py-3 mb-5 text-base rounded-full
    bg-gray-100/40 text-gray-400 font-medium
    border border-gray-300/30
    backdrop-blur-sm
    cursor-not-allowed
    shadow-sm
    hover:scale-100 hover:shadow-none hover:brightness-100
    transition-all duration-200"
                                >
                                    로그인 후 이용할 수 있습니다
                                </PrimaryButton>
                            ) : (
                                <>
                                    {!isSaved ? (
                                        <PrimaryButton
                                            additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full bg-amber-400 text-black hover:bg-amber-300"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중...
              </span>
                                            ) : (
                                                "💾 MCP 저장하기"
                                            )}
                                        </PrimaryButton>
                                    ) : (
                                        <PrimaryButton
                                            additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
                                            onClick={handleGoToChat}
                                        >
                                            Go to Chat
                                        </PrimaryButton>
                                    )}
                                </>
                            )}

                            <McpUrlCopy url={detail.requestUrl ?? undefined} />
                            <McpDetails data={detail} />
                        </div>
                    </aside>



                </div>
            </div>

            <McpConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConnected={handleConnected}
                mcpName={detail.name}
                platformId={platformId}
            />
        </>
    );
}
