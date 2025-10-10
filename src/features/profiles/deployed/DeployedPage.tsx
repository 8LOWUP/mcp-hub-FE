"use client";

import React from "react";
import { PROFILES_STYLES, PROFILE_GRID_COLS } from "@/features/profiles/constants";
import { McpItemType } from "@/features/profiles/types";
import { DUMMY_DRAFT_LIST } from "./constants";
import { DeployedCard, DraftCard } from "./components/cards";
import DeleteMcpFlowModal from "@/features/profiles/components/modals/DeleteMcpFlowModal";

// ✅ 실데이터 훅 ( /mcps/dashboard 연동 )
import { useMyUploadedMcps } from "./hooks/useMyUploadedMcps";
// ✅ 삭제 API 추가
import { deleteMyUploadedMcp } from "./apis/mcp";

const DeployedPage: React.FC = () => {
    const [drafts] = React.useState<McpItemType[]>(DUMMY_DRAFT_LIST);

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

    // 삭제 플로우 (단일 모달)
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const openDelete = (id: string) => setTargetId(id);
    const closeDelete = () => setTargetId(null);

    const confirmDelete = async () => {
        if (!targetId) return;
        try {
            // ✅ 서버 삭제 호출
            const res = await deleteMyUploadedMcp(targetId);
            console.log("[deleteMyUploadedMcp] ✓", res.message);

            // ✅ 마지막 페이지에서 마지막 항목을 삭제한 경우 한 페이지 앞으로 이동
            if (pagination.isLast && items.length === 1 && (pagination.page ?? 0) > 0) {
                setPage((pagination.page ?? 1) - 1);
            } else {
                await refetch();
            }
        } catch (e) {
            console.error("[deleteMyUploadedMcp] ✗", e);
        } finally {
            // ✅ UX에 따라 닫기 (현재 구조에서는 닫는 게 자연스러움)
            closeDelete();
        }
    };

    const handleEditDraft = (id: string) => {
        console.log("edit draft:", id);
    };

    return (
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            {/* 배포한 MCP 섹션 */}
            <div className="mt-6">
                <div className="mb-3">
                    <h2 className="text-title2">배포한 MCP</h2>
                    <p className="text-body3 text-secondary">자신이 올린 MCP를 관리합니다.</p>
                </div>

                {isLoading && (
                    <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl bg-red-50 px-6 py-4 text-center text-body3 text-red-500">
                        ❌ {error}
                    </div>
                )}

                {!isLoading && !error && (items?.length ?? 0) > 0 ? (
                    <>
                        <div className={PROFILE_GRID_COLS}>
                            {items.map((item) => (
                                <DeployedCard key={item.id} item={item} onDelete={openDelete} />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    className="px-3 py-2 rounded-md border text-sm"
                                    disabled={pagination.isFirst}
                                    onClick={() => setPage(Math.max(0, (pagination.page ?? 0) - 1))}
                                >
                                    Prev
                                </button>
                                <span className="text-sm opacity-70">
                                    {Number(pagination.page ?? 0) + 1} / {pagination.totalPages}
                                </span>
                                <button
                                    className="px-3 py-2 rounded-md border text-sm"
                                    disabled={pagination.isLast}
                                    onClick={() => setPage((pagination.page ?? 0) + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    !isLoading &&
                    !error && (
                        <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                            배포된 MCP가 없습니다.
                        </div>
                    )
                )}
            </div>

            {/* 임시저장 MCP 섹션 */}
            <div className="mt-10">
                <div className="mb-3">
                    <h2 className="text-title2">임시저장 MCP</h2>
                    <p className="text-body3 text-secondary">임시저장된 MCP</p>
                </div>

                {drafts.length ? (
                    <div className={PROFILE_GRID_COLS}>
                        {drafts.map((item) => (
                            <DraftCard key={item.id} item={item} onEdit={handleEditDraft} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                        임시저장된 MCP가 없습니다.
                    </div>
                )}
            </div>

            {/* 단일 플로우 삭제 모달 */}
            <DeleteMcpFlowModal
                isOpen={!!targetId}
                onClose={closeDelete}
                onConfirm={confirmDelete}
            />
        </section>
    );
};

export default DeployedPage;
