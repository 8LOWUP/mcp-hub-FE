// src/features/profiles/components/page/ProfilePage.tsx
"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import ProfileHeader from "../header/ProfileHeader";
import { ProfileCard } from "../card";
import DeleteMcpFlowModal from "../modals/DeleteMcpFlowModal";
import ApiKeyFlowModal from "../modals/ApiKeyFlowModal";
import { PROFILE_GRID_COLS, PROFILES_STYLES } from "../../constants";

import { useMyProfile } from "@/hooks/profiles/useMyProfile";
import { useMyMcps } from "@/features/profiles/hooks/useMyMcps";

import { checkWorkspaceMcpToken } from "@/services/workspaces/mcps/check";
import { getWorkspaceMcpToken, saveWorkspaceMcpToken } from "@/services/workspaces/mcps/token";

const ProfilePage: React.FC = () => {
    const { profile, isLoading: isProfileLoading, error: profileError } = useMyProfile();
    const {
        list,
        isLoading: isMcpsLoading,
        error: mcpsError,
        fetchList,
        deleteOne,
        setPage,
        page,
        totalPages,
    } = useMyMcps({ page: 0, size: 12, sort: "createdAt,desc" });

    /** 삭제 플로우 */
    const [targetId, setTargetId] = useState<string | null>(null);
    const handleOpenDelete = (id: string) => setTargetId(id);
    const handleCloseDelete = () => setTargetId(null);
    const handleConfirmDelete = async () => {
        if (!targetId) return;
        toast.loading("MCP 삭제 중입니다...", { id: "delete" });
        const ok = await deleteOne(targetId);
        toast[ok ? "success" : "error"](
            ok ? "MCP가 성공적으로 삭제되었습니다." : "MCP 삭제에 실패했습니다.",
            { id: "delete" }
        );
        setTargetId(null);
    };

    /** API Key 모달 상태/데이터 */
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
    const [modalApiKey, setModalApiKey] = useState("");
    const [modalLoading, setModalLoading] = useState(false);

    /** API Key 버튼 클릭 → 모달 즉시 오픈 → platformId 확보 → 현재 토큰 프리필 */
    const handleOpenApiKey = async (platformIdOrNull: string | null, mcpId: number) => {
        // 일단 모달 열어서 사용자에게 즉시 피드백
        setIsApiModalOpen(true);
        setModalLoading(true);
        setModalApiKey("");
        setSelectedPlatformId(null);

        try {
            // mcpId 방어적 보정
            const numericId = Number(mcpId);
            if (Number.isNaN(numericId)) {
                console.warn("[ProfilePage] invalid mcpId for ApiKey modal:", { mcpId });
                toast.error("유효하지 않은 MCP ID입니다.");
                setModalLoading(false);
                return;
            }

            // platformId 없으면 check API로 역조회
            let pf = platformIdOrNull;
            if (!pf) {
                const check = await checkWorkspaceMcpToken(numericId);
                pf = check.platformId;
                if (!pf) {
                    toast.error("이 MCP의 platformId를 찾을 수 없습니다.");
                    setModalLoading(false);
                    return;
                }
            }
            setSelectedPlatformId(pf);

            // 현재 저장된 토큰 프리필 (없으면 빈 문자열)
            try {
                const tokenRes = await getWorkspaceMcpToken(pf);
                setModalApiKey(tokenRes?.token ?? "");
            } catch {
                setModalApiKey("");
            }
        } catch (e) {
            console.error("[ProfilePage] handleOpenApiKey error:", e);
            toast.error("플랫폼 정보를 불러오지 못했습니다.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseApiKey = () => {
        setIsApiModalOpen(false);
        setSelectedPlatformId(null);
        setModalApiKey("");
        setModalLoading(false);
    };

    /** 저장(등록/수정) */
    const handleEditApiKey = async (nextKey: string) => {
        if (!selectedPlatformId) {
            toast.error("플랫폼 정보를 불러오는 중입니다.");
            return;
        }
        try {
            setModalLoading(true);
            await saveWorkspaceMcpToken(selectedPlatformId, nextKey);
            setModalApiKey(nextKey);
            toast.success("API Key가 저장되었습니다.");
            setIsApiModalOpen(false); // 모달 유지 원하면 이 줄 제거
        } catch (e) {
            console.error("[ProfilePage] handleEditApiKey error:", e);
            toast.error("저장에 실패했습니다.");
        } finally {
            setModalLoading(false);
        }
    };

    /** 삭제 (= 빈 문자열 저장) */
    const handleDeleteApiKey = async () => {
        if (!selectedPlatformId) {
            toast.error("플랫폼 정보를 불러오는 중입니다.");
            return;
        }
        try {
            setModalLoading(true);
            await saveWorkspaceMcpToken(selectedPlatformId, "");
            setModalApiKey("");
            toast.success("API Key가 삭제되었습니다.");
            setIsApiModalOpen(false); // 모달 유지 원하면 이 줄 제거
        } catch (e) {
            console.error("[ProfilePage] handleDeleteApiKey error:", e);
            toast.error("삭제에 실패했습니다.");
        } finally {
            setModalLoading(false);
        }
    };

    const nickname = profile?.nickname ?? "사용자";
    const email = profile?.email ?? "";
    const isLoading = isProfileLoading || isMcpsLoading;
    const error = profileError || mcpsError;

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
                    <p className="mt-2 text-body3 text-secondary">{String(error)}</p>
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
                    <p className="mt-2 text-body3 text-secondary">MCP Market에서 새로운 MCP를 추가해보세요.</p>
                </div>
            ) : (
                <>
                    <section className={PROFILE_GRID_COLS}>
                        {list.map((item) => (
                            <ProfileCard
                                key={item.id}
                                item={item}
                                onClose={() => handleOpenDelete(item.id)}
                                // 카드가 platformId가 없을 수 있으므로 (null, mcpId) 형태로 전달
                                onClickApiKey={(pf, mid) => handleOpenApiKey(pf, mid)}
                            />
                        ))}
                    </section>

                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <button
                                className="rounded border px-3 py-1 disabled:opacity-40"
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
                                className="rounded border px-3 py-1 disabled:opacity-40"
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

            <DeleteMcpFlowModal
                isOpen={!!targetId}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />

            {/* API Key 관리 모달 */}
            <ApiKeyFlowModal
                isOpen={isApiModalOpen}
                onClose={handleCloseApiKey}
                apiKey={modalApiKey}
                onEdit={handleEditApiKey}
                onDelete={handleDeleteApiKey}
            />
        </section>
    );
};

export default ProfilePage;
