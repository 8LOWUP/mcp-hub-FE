"use client";

import React from "react";
import { PROFILES_STYLES, PROFILE_GRID_COLS } from "@/features/profiles/constants";
import { McpItemType } from "@/features/profiles/types";
import { DUMMY_DEPLOYED_LIST, DUMMY_DRAFT_LIST } from "./constants";
import { DeployedCard, DraftCard } from "./components/cards";
import DeleteMcpModal from "@/features/profiles/components/modals/DeleteMcpModal";
import DeleteMcpSuccessModal from "@/features/profiles/components/modals/DeleteMcpSuccessModal";

const DeployedPage: React.FC = () => {
    const [deployed, setDeployed] = React.useState<McpItemType[]>(DUMMY_DEPLOYED_LIST);
    const [drafts, setDrafts] = React.useState<McpItemType[]>(DUMMY_DRAFT_LIST);

    // 삭제 플로우
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const [isDeleted, setIsDeleted] = React.useState(false);

    const openDelete = (id: string) => setTargetId(id);
    const closeDelete = () => setTargetId(null);
    const confirmDelete = () => {
        if (!targetId) return;
        setDeployed(prev => prev.filter(i => i.id !== targetId));
        setTargetId(null);
        setIsDeleted(true);
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

                {deployed.length ? (
                    <div className={PROFILE_GRID_COLS}>
                        {deployed.map(item => (
                            <DeployedCard key={item.id} item={item} onDelete={openDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                        배포된 MCP가 없습니다.
                    </div>
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
                        {drafts.map(item => (
                            <DraftCard key={item.id} item={item} onEdit={handleEditDraft} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-surface-2 px-6 py-8 text-center text-body3 text-secondary">
                        임시저장된 MCP가 없습니다.
                    </div>
                )}
            </div>

            {/* 삭제 모달 */}
            <DeleteMcpModal isOpen={!!targetId} onClose={closeDelete} onConfirm={confirmDelete} />
            <DeleteMcpSuccessModal isOpen={isDeleted} onClose={() => setIsDeleted(false)} />
        </section>
    );
};

export default DeployedPage;
