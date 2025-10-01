"use client";

import React from "react";
import ProfileHeader from "../header/ProfileHeader";
import { ProfileCard, DUMMY_MCP_LIST } from "../card";
import DeleteMcpFlowModal from "../modals/DeleteMcpFlowModal";
import ApiKeyFlowModal from "../modals/ApiKeyFlowModal";
import { PROFILE_GRID_COLS, PROFILES_STYLES } from "../../constants";
import { McpItemType } from "../../types";
import { useMyProfile } from "@/hooks/profiles/useMyProfile";

const ProfilePage: React.FC = () => {
    /* 1) 모든 Hook을 최상단에서 “항상” 호출 */
    const { profile, isLoading, error /*, updateProfile*/ } = useMyProfile();

    // (임시) MCP 리스트 – BE 연동 전까지 DUMMY 유지
    const [list, setList] = React.useState<McpItemType[]>(DUMMY_MCP_LIST);

    // 카드 삭제 플로우
    const [targetId, setTargetId] = React.useState<string | null>(null);
    const openDelete = (id: string) => setTargetId(id);
    const closeDelete = () => setTargetId(null);
    const confirmDelete = async () => {
        if (!targetId) return;
        // TODO: 서버 삭제 API 호출 (DELETE /profiles/mcps/{id})
        setList((prev) => prev.filter((item) => item.id !== targetId));
    };

    // API Key 플로우
    const [apiFlowId, setApiFlowId] = React.useState<string | null>(null);
    const apiTarget = React.useMemo(
        () => list.find((i) => i.id === apiFlowId) ?? null,
        [list, apiFlowId]
    );
    const openApiFlow = (id: string) => setApiFlowId(id);
    const closeApiFlow = () => setApiFlowId(null);
    const handleEditApiKey = async (nextKey: string) => {
        // TODO: PATCH /profiles/mcps/{id}/api-key
        setList((prev) => prev.map((i) => (i.id === apiFlowId ? { ...i, apiKey: nextKey } : i)));
    };
    const handleDeleteApiKey = async () => {
        // TODO: DELETE /profiles/mcps/{id}/api-key
        setList((prev) => prev.map((i) => (i.id === apiFlowId ? { ...i, apiKey: "" } : i)));
    };

    // 표시용 파생값
    const nickname = profile?.nickname ?? "사용자";
    const email = profile?.email ?? "";

    /* 2) 로딩/에러는 JSX에서 조건부로 처리 (early return로 Hook 수 바꾸지 않기) */
    return (
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            {isLoading ? (
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">프로필 불러오는 중...</p>
                </div>
            ) : error ? (
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold text-red-500">프로필 로드 실패</p>
                    <p className="mt-2 text-body3 text-secondary">{error}</p>
                </div>
            ) : (
                <>
                    <ProfileHeader
                        title={`${nickname}님의 MCP`}
                        subtitle={
                            email
                                ? `${email} 계정에서 저장한 MCP를 관리합니다.`
                                : "자신이 좋아하거나 즐겨찾는 MCP들을 관리하는 페이지"
                        }
                    />

                    {list.length === 0 ? (
                        <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                            <p className="text-title2 font-semibold">저장된 MCP가 없습니다.</p>
                            <p className="mt-2 text-body3 text-secondary">우측 상단에서 새 MCP를 추가해보세요.</p>
                        </div>
                    ) : (
                        <section className={PROFILE_GRID_COLS}>
                            {list.map((item) => (
                                <ProfileCard
                                    key={item.id}
                                    item={item}
                                    onClose={() => openDelete(item.id)}
                                    onClickApiKey={() => openApiFlow(item.id)}
                                />
                            ))}
                        </section>
                    )}
                </>
            )}

            {/* MCP 삭제 모달 */}
            <DeleteMcpFlowModal
                isOpen={!!targetId}
                onClose={closeDelete}
                onConfirm={confirmDelete}
            />

            {/* API Key 관리 모달 */}
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
