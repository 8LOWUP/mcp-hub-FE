"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { PROFILES_STYLES, PROFILE_GRID_COLS } from "@/features/profiles/constants";
import { McpItemType } from "@/features/profiles/types";
import { DeployedCard, DraftCard } from "./components/cards";
import DeleteMcpFlowModal from "@/features/profiles/components/modals/DeleteMcpFlowModal";

import { useMyUploadedMcps } from "./hooks/useMyUploadedMcps";
import { deleteMyUploadedMcp } from "./apis/mcp";
import { mapToCard } from "./utils/map";

const DeployedPage: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";

    const {
        items,
        isLoading,
        error,
        pagination,
        setPage,
        refetch,
    } = useMyUploadedMcps({
        page: 0,
        size: 12,
        sort: "publishedDate,desc",
        category: "",
        search: "",
    });

    // 서버 데이터 → 카드로 변환
    const cards: McpItemType[] = (items ?? []).map(mapToCard);
    const deployed = cards.filter((c) => c.published === true);
    const drafts   = cards.filter((c) => c.published === false);

    // 삭제 모달
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const openDelete = (id: string) => setTargetId(id);
    const closeDelete = () => setTargetId(null);

    const confirmDelete = async () => {
        if (!targetId) return;
        try {
            const res = await deleteMyUploadedMcp(targetId);
            console.log("[deleteMyUploadedMcp] ✓", res.message);

            if (pagination.isLast && deployed.length === 1 && (pagination.page ?? 0) > 0) {
                setPage((pagination.page ?? 1) - 1);
            } else {
                await refetch();
            }
        } catch (e) {
            console.error("[deleteMyUploadedMcp] ✗", e);
        } finally {
            closeDelete();
        }
    };

    // ✅ 숫자 mcpId로 업로드 페이지 이동
    const handleEditDraft = (mcpId: number) => {
        if (!Number.isFinite(mcpId) || mcpId <= 0) return;
        router.push(`/${locale}/upload?mcpId=${mcpId}&mode=edit`);
    };

    return (
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            {/* 배포한 MCP */}
            <div className="mt-6">
                <div className="mb-3">
                    <h2 className="text-title2">배포한 MCP</h2>
                    <p className="text-body3 text-secondary">자신이 올린 MCP를 관리합니다.</p>
                </div>

                {isLoading && (
                    <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">Loading...</div>
                )}
                {error && <div className="rounded-2xl bg-red-50 px-6 py-4 text-center text-body3 text-red-500">❌ {error}</div>}

                {!isLoading && !error && deployed.length > 0 ? (
                    <>
                        <div className={PROFILE_GRID_COLS}>
                            {deployed.map((item) => (
                                <DeployedCard key={item.id} item={item} onDelete={openDelete} />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    className="px-3 py-2 rounded-md border text-sm"
                                    disabled={pagination.isFirst}
                                    onClick={() => setPage(Math.max(0, (pagination.page ?? 0) - 1))}
                                >Prev</button>
                                <span className="text-sm opacity-70">
                  {Number(pagination.page ?? 0) + 1} / {pagination.totalPages}
                </span>
                                <button
                                    className="px-3 py-2 rounded-md border text-sm"
                                    disabled={pagination.isLast}
                                    onClick={() => setPage((pagination.page ?? 0) + 1)}
                                >Next</button>
                            </div>
                        )}
                    </>
                ) : (
                    !isLoading && !error && (
                        <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                            배포된 MCP가 없습니다.
                        </div>
                    )
                )}
            </div>

            {/* 임시저장 MCP */}
            <div className="mt-10">
                <div className="mb-3">
                    <h2 className="text-title2">임시저장 MCP</h2>
                    <p className="text-body3 text-secondary">임시저장된 MCP</p>
                </div>

                {!isLoading && !error && drafts.length ? (
                    <div className={PROFILE_GRID_COLS}>
                        {drafts.map((item) => (
                            <DraftCard key={item.id} item={item} onEdit={handleEditDraft} />
                        ))}
                    </div>
                ) : (
                    !isLoading && !error && (
                        <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                            임시저장된 MCP가 없습니다.
                        </div>
                    )
                )}
            </div>

            <DeleteMcpFlowModal isOpen={!!targetId} onClose={closeDelete} onConfirm={confirmDelete} />
        </section>
    );
};

export default DeployedPage;
