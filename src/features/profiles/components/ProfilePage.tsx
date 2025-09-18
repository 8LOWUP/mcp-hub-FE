// src/features/profiles/components/ProfilePage.tsx
"use client";

import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import DeleteMcpModal from "./modals/DeleteMcpModal";
import DeleteMcpSuccessModal from "./modals/DeleteMcpSuccessModal";
import ApiKeyFlowModal from "./modals/ApiKeyFlowModal";
import { DUMMY_MCP_LIST, PROFILE_GRID_COLS } from "../constants";
import { McpItemType } from "../types";

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
    const apiTarget = list.find(i => i.id === apiFlowId) ?? null;

    // 🔥 모달 닫힌 직후 노란 hover가 고정되는 걸 막기 위한 플래그
    const [suppressHoverId, setSuppressHoverId] = React.useState<string | null>(null);

    const openApiFlow = (id: string) => setApiFlowId(id);

    const closeApiFlow = () => {
        if (apiFlowId) {
            const justClosed = apiFlowId;
            setApiFlowId(null);

            // 닫자마자 해당 버튼 hover 비활성화
            setSuppressHoverId(justClosed);

            // ✅ 다음 번 실제 마우스 움직임이 감지되면 hover 재활성화
            const clearOnMove = () => {
                setSuppressHoverId(null);
                window.removeEventListener("mousemove", clearOnMove, { capture: true });
            };
            window.addEventListener("mousemove", clearOnMove, { capture: true, once: true });
        } else {
            setApiFlowId(null);
        }
    };

    const handleEditApiKey = async (nextKey: string) => {
        // TODO: 서버 저장
        setList(prev =>
            prev.map(i => (i.id === apiFlowId ? { ...i, apiKey: nextKey } : i))
        );
    };

    const handleDeleteApiKey = async () => {
        // TODO: 서버에서 키 삭제
        setList(prev =>
            prev.map(i => (i.id === apiFlowId ? { ...i, apiKey: "" } : i))
        );
    };

    return (
        <section className="p-6 md:p-8">
            <ProfileHeader
                title="내가 저장한 MCP"
                subtitle="자신이 좋아하거나 즐겨찾는 MCP들을 관리하는 페이지"
            />

            <div className={PROFILE_GRID_COLS}>
                {list.map(item => (
                    <ProfileCard
                        key={item.id}
                        item={item}
                        onClose={() => openDelete(item.id)}
                        onClickApiKey={() => openApiFlow(item.id)}
                        // ✅ 모달이 열려있거나 방금 닫혀서 suppress 중이면 hover를 막는다
                        disableHover={apiFlowId === item.id || suppressHoverId === item.id}
                    />
                ))}
            </div>

            {/* 카드 삭제 확인 모달 */}
            <DeleteMcpModal
                isOpen={!!targetId}
                onClose={closeDelete}
                onConfirm={confirmDelete}
            />

            {/* 카드 삭제 완료 모달 */}
            <DeleteMcpSuccessModal
                isOpen={isDeleted}
                onClose={() => setIsDeleted(false)}
            />

            {/* API Key 관리 모달(내부에서 편집/삭제 플로우 처리) */}
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
