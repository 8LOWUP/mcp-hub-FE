// src/features/profiles/components/ProfilePage.tsx
"use client";

import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import DeleteMcpModal from "./modals/DeleteMcpModal";
import DeleteMcpSuccessModal from "./modals/DeleteMcpSuccessModal";
import { DUMMY_MCP_LIST, PROFILE_GRID_COLS } from "../constants";
import { McpItemType } from "../types";

const ProfilePage: React.FC = () => {
    const [list, setList] = React.useState<McpItemType[]>(DUMMY_MCP_LIST);
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const [isDeleted, setIsDeleted] = React.useState(false);

    const handleOpenDelete = (id: string) => setTargetId(id);
    const handleCloseDelete = () => setTargetId(null);

    const handleConfirmDelete = () => {
        if (!targetId) return;
        // TODO: 실제 삭제 API 호출 자리
        setList((prev) => prev.filter((item) => item.id !== targetId));
        setTargetId(null);
        setIsDeleted(true);
    };

    return (
        <section className="p-6 md:p-8">
            <ProfileHeader
                title="내가 저장한 MCP"
                subtitle="자신이 좋아하거나 즐겨찾는 MCP들을 관리하는 페이지"
            />

            <div className={PROFILE_GRID_COLS}>
                {list.map((item) => (
                    <ProfileCard
                        key={item.id}
                        item={item}
                        onClose={() => handleOpenDelete(item.id)}
                    />
                ))}
            </div>

            {/* 삭제 확인 모달 */}
            <DeleteMcpModal
                isOpen={!!targetId}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />

            {/* 삭제 완료 모달 */}
            <DeleteMcpSuccessModal
                isOpen={isDeleted}
                onClose={() => setIsDeleted(false)}
            />

        </section>
    );
};

export default ProfilePage;
