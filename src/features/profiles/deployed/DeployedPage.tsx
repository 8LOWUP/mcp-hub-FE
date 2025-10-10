// src/features/profiles/deployed/DeployedPage.tsx
"use client";

import React from "react";
import { PROFILES_STYLES, PROFILE_GRID_COLS } from "@/features/profiles/constants";
import { McpItemType } from "@/features/profiles/types"; // 카드 타입
import { DUMMY_DEPLOYED_LIST, DUMMY_DRAFT_LIST } from "./constants";
import { DeployedCard, DraftCard } from "./components/cards";
import DeleteMcpFlowModal from "@/features/profiles/components/modals/DeleteMcpFlowModal";

// ✅ 실데이터 훅 ( /mcps/dashboard 연동 )
import { useMyUploadedMcps } from "./hooks/useMyUploadedMcps";

const DeployedPage: React.FC = () => {
    // 임시저장(Drafts)은 기존 더미 유지
    const [drafts] = React.useState<McpItemType[]>(DUMMY_DRAFT_LIST);

    // ✅ 업로드 MCP: 서버 연동
    const {
        items,               // McpItemType[] (서버 응답 매핑됨)
        isLoading,
        error,
        pagination,          // { page, size, totalPages, totalElements, isFirst, isLast }
        setPage,
        setSize,
        setSort,
        setCategory,
        setSearch,
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
            // TODO: 서버 삭제 API 호출 (ex: DELETE /mcps/{id})
            // await deleteMcp(targetId);

            // 서버 삭제 후 최신 목록 다시 가져오기
            await refetch();
        } finally {
            // 통합 모달 내부에서 confirm → done 화면으로 바뀐다면 닫지 않아도 되고,
            // 현재 구조에선 닫아주는 게 UX 상 자연스러우면 아래 주석 해제
            // closeDelete();
        }
    };

    // Draft 편집 (임시)
    const handleEditDraft = (id: string) => {
        // TODO: 편집 모달/페이지 이동 로직
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

                        {/* 페이지네이션 */}
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

            {/* 임시저장 MCP 섹션 (더미 유지) */}
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

            {/* 단일 플로우 삭제 모달 (confirm → done) */}
            <DeleteMcpFlowModal isOpen={!!targetId} onClose={closeDelete} onConfirm={confirmDelete} />
        </section>
    );
};

export default DeployedPage;
