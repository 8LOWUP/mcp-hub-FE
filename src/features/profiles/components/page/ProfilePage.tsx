"use client";

import React, { useMemo, useState } from "react";
import ProfileHeader from "../header/ProfileHeader";
import { ProfileCard } from "../card";
import DeleteMcpFlowModal from "../modals/DeleteMcpFlowModal";
import ApiKeyFlowModal from "../modals/ApiKeyFlowModal";
import { PROFILE_GRID_COLS, PROFILES_STYLES } from "../../constants";
import { useMyProfile } from "@/hooks/profiles/useMyProfile";
import { useMyMcps } from "@/features/profiles/hooks/useMyMcps";

const ProfilePage: React.FC = () => {
    /* ================================
     * 1) 프로필 & MCP 리스트 로드
     * ================================ */
    const { profile, isLoading: isProfileLoading, error: profileError } = useMyProfile();
    const {
        list,
        isLoading: isMcpsLoading,
        error: mcpsError,
        fetchList,
        setPage,
        page,
        totalPages,
    } = useMyMcps({ page: 0, size: 12, sort: "createdAt,desc" });

    /* ================================
     * 2) MCP 삭제 / API Key 관련 로직
     * ================================ */
    const [targetId, setTargetId] = useState<string | null>(null);
    const [apiFlowId, setApiFlowId] = useState<string | null>(null);

    const apiTarget = useMemo(
        () => list.find((i) => i.id === apiFlowId) ?? null,
        [list, apiFlowId]
    );

    const handleOpenDelete = (id: string) => setTargetId(id);
    const handleCloseDelete = () => setTargetId(null);
    const handleConfirmDelete = async () => {
        if (!targetId) return;
        // TODO: 서버 삭제 API 연동 (DELETE /mcps/{id})
        setTargetId(null);
        await fetchList();
    };

    const handleOpenApiKey = (id: string) => setApiFlowId(id);
    const handleCloseApiKey = () => setApiFlowId(null);
    const handleEditApiKey = async (nextKey: string) => {
        // TODO: PATCH /mcps/{id}/api-key
        console.log("edit api key:", nextKey);
    };
    const handleDeleteApiKey = async () => {
        // TODO: DELETE /mcps/{id}/api-key
        console.log("delete api key");
    };

    /* ================================
     * 3) 파생값 및 상태
     * ================================ */
    const nickname = profile?.nickname ?? "사용자";
    const email = profile?.email ?? "";
    const isLoading = isProfileLoading || isMcpsLoading;
    const error = profileError || mcpsError;

    /* ================================
     * 4) 렌더링
     * ================================ */
    if (isLoading) {
        return (
            <section className={PROFILES_STYLES.PAGE_PADDING}>
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">데이터 불러오는 중...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={PROFILES_STYLES.PAGE_PADDING}>
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold text-red-500">데이터 로드 실패</p>
                    <p className="mt-2 text-body3 text-secondary">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            <ProfileHeader
                title={`${nickname}님의 MCP`}
                subtitle={
                    email
                        ? `${email} 계정에서 저장한 MCP를 관리합니다.`
                        : "자신이 즐겨찾는 MCP를 관리할 수 있습니다."
                }
            />

            {list.length === 0 ? (
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">저장된 MCP가 없습니다.</p>
                    <p className="mt-2 text-body3 text-secondary">
                        MCP Market에서 새로운 MCP를 추가해보세요.
                    </p>
                </div>
            ) : (
                <>
                    <section className={PROFILE_GRID_COLS}>
                        {list.map((item) => (
                            <ProfileCard
                                key={item.id}
                                item={item}
                                onClose={() => handleOpenDelete(item.id)}
                                onClickApiKey={() => handleOpenApiKey(item.id)}
                            />
                        ))}
                    </section>

                    {/* 페이지네이션 예시 */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <button
                                className="px-3 py-1 border rounded disabled:opacity-40"
                                onClick={() => {
                                    if (page > 0) {
                                        setPage(page - 1);
                                        fetchList({ page: page - 1 });
                                    }
                                }}
                                disabled={page <= 0}
                            >
                                이전
                            </button>
                            <button
                                className="px-3 py-1 border rounded disabled:opacity-40"
                                onClick={() => {
                                    if (page < totalPages - 1) {
                                        setPage(page + 1);
                                        fetchList({ page: page + 1 });
                                    }
                                }}
                                disabled={page >= totalPages - 1}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* MCP 삭제 모달 */}
            <DeleteMcpFlowModal
                isOpen={!!targetId}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />

            {/* API Key 관리 모달 */}
            <ApiKeyFlowModal
                isOpen={!!apiFlowId}
                onClose={handleCloseApiKey}
                apiKey={apiTarget?.apiKey ?? ""}
                onEdit={handleEditApiKey}
                onDelete={handleDeleteApiKey}
            />
        </section>
    );
};

export default ProfilePage;
