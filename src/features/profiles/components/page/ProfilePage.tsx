"use client";

import React from "react";
import ProfileHeader from "../header/ProfileHeader";
import { ProfileCard, DUMMY_MCP_LIST } from "../card";
import DeleteMcpModal from "../modals/DeleteMcpModal";
import DeleteMcpSuccessModal from "../modals/DeleteMcpSuccessModal";
import ApiKeyFlowModal from "../modals/ApiKeyFlowModal";
import { PROFILE_GRID_COLS, PROFILES_STYLES } from "../../constants";
import { McpItemType } from "../../types";

const ProfilePage: React.FC = () => {
    const [list, setList] = React.useState<McpItemType[]>(DUMMY_MCP_LIST);

    /** ── 카드 삭제(X) 플로우 ───────────────────────────────────────── */
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const [isDeleted, setIsDeleted] = React.useState(false);

    const openDelete = (id: string) => setTargetId(id);
    const closeDelete = () => setTargetId(null);
    const confirmDelete = () => {
        if (!targetId) return;
        // TODO: 서버 삭제 API 호출
        setList(prev => prev.filter(item => item.id !== targetId));
        setTargetId(null);
        setIsDeleted(true);
    };

    /** ── API Key 관리 플로우 ───────────────────────────────────────── */
    const [apiFlowId, setApiFlowId] = React.useState<string | null>(null);
    const apiTarget = React.useMemo(
        () => list.find(i => i.id === apiFlowId) ?? null,
        [list, apiFlowId],
    );

    const openApiFlow = (id: string) => setApiFlowId(id);
    const closeApiFlow = () => setApiFlowId(null);

    const handleEditApiKey = async (nextKey: string) => {
        // TODO: 서버 저장
        setList(prev => prev.map(i => (i.id === apiFlowId ? { ...i, apiKey: nextKey } : i)));
    };

    const handleDeleteApiKey = async () => {
        // TODO: 서버에서 키 삭제
        setList(prev => prev.map(i => (i.id === apiFlowId ? { ...i, apiKey: "" } : i)));
    };

    return (
        // ✅ 메인 콘텐츠만 렌더 (사이드바는 layout.tsx가 렌더)
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            <ProfileHeader
                title="내가 저장한 MCP"
                subtitle="자신이 좋아하거나 즐겨찾는 MCP들을 관리하는 페이지"
            />

            {list.length === 0 ? (
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">저장된 MCP가 없습니다.</p>
                    <p className="mt-2 text-body3 text-secondary">우측 상단에서 새 MCP를 추가해보세요.</p>
                </div>
            ) : (
                <section className={PROFILE_GRID_COLS}>
                    {list.map(item => (
                        <ProfileCard
                            key={item.id}
                            item={item}
                            onClose={() => openDelete(item.id)}
                            onClickApiKey={() => openApiFlow(item.id)}
                        />
                    ))}
                </section>
            )}

            {/* 모달들 */}
            <DeleteMcpModal isOpen={!!targetId} onClose={closeDelete} onConfirm={confirmDelete} />
            <DeleteMcpSuccessModal isOpen={isDeleted} onClose={() => setIsDeleted(false)} />
            <ApiKeyFlowModal
                isOpen={!!apiFlowId}
                onClose={closeApiFlow}
                apiKey={apiTarget?.apiKey ?? ""}
                onEdit={handleEditApiKey}
                onDelete={handleDeleteApiKey}
            />
        </section>
    );
};

export default ProfilePage;
