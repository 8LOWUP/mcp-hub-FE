// src/features/profiles/components/page/ProfilePage.tsx
"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

import ProfileHeader from "../header/ProfileHeader";
import { ProfileCard } from "../card";
import DeleteMcpFlowModal from "../modals/DeleteMcpFlowModal";
import ApiKeyFlowModal from "../modals/ApiKeyFlowModal";
import { PROFILE_GRID_COLS, PROFILES_STYLES } from "../../constants";

import { useMyProfile } from "@/hooks/profiles/useMyProfile";
import { useMyMcps } from "@/features/profiles/hooks/useMyMcps";

import { checkWorkspaceMcpToken } from "@/services/workspaces/mcps/check";
// ⛳ 아래 두 줄은 더 이상 필요 없습니다.
// import { getWorkspaceMcpToken, saveWorkspaceMcpToken } from "@/services/workspaces/mcps/token";

const ProfilePage: React.FC = () => {
    // Locale translations
    const t = useTranslations('ProfilePage');
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
    } = useMyMcps({ page: 0, size: 12 });

    /** 삭제 플로우 */
    const [targetId, setTargetId] = useState<string | null>(null);
    const handleOpenDelete = (id: string) => setTargetId(id);
    const handleCloseDelete = () => setTargetId(null);
    const handleConfirmDelete = async () => {
        if (!targetId) return;
        const ok = await deleteOne(targetId);
        toast[ok ? "success" : "error"](
            ok ? t('mcpDeleteSuccess') : t('mcpDeleteError')
        );
        setTargetId(null);
    };

    /** API Key 모달 */
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [selectedPlatformId, setSelectedPlatformId] = useState<string>(""); // ✅ 문자열로 보관

    /** 카드의 API Key 버튼 클릭 */
    const handleOpenApiKey = async (platformIdOrNull: string | null, mcpId: number) => {
        // 1) 우선 카드에서 온 pf 사용
        let pf = platformIdOrNull ? String(platformIdOrNull) : "";

        // 2) 없으면 서버에서 보완
        if (!pf) {
            const numericId = Number(mcpId);
            if (Number.isNaN(numericId)) {
                toast.error(t('invalidMcpId'));
                return;
            }
            try {
                const check = await checkWorkspaceMcpToken(numericId);
                pf = check.platformId ? String(check.platformId) : "";
            } catch {
                pf = "";
            }
        }

        if (!pf) {
            toast.error(t('platformIdNotFound'));
            return;
        }

        setSelectedPlatformId(pf);      // ✅ 반드시 문자열
        setIsApiModalOpen(true);
    };

    const handleCloseApiKey = () => {
        setIsApiModalOpen(false);
        setSelectedPlatformId("");
    };

    const nickname = profile?.nickname ?? t('defaultUser');
    const email = profile?.email ?? "";
    const isLoading = isProfileLoading || isMcpsLoading;
    const error = profileError || mcpsError;

    if (isLoading) {
        return (
            <section className={PROFILES_STYLES.PAGE_PADDING}>
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">{t('loading')}</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={PROFILES_STYLES.PAGE_PADDING}>
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold text-red-500">{t('loadError')}</p>
                    <p className="mt-2 text-body3 text-secondary">{String(error)}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={PROFILES_STYLES.PAGE_PADDING}>
            <ProfileHeader
                title={t('userMcps', { nickname })}
                subtitle={
                    email
                        ? t('manageMcpsFromAccount', { email })
                        : t('manageFavoriteMcps')
                }
            />

            {list.length === 0 ? (
                <div className="rounded-2xl bg-surface-2 px-6 py-10 text-center">
                    <p className="text-title2 font-semibold">{t('noStoredMcps')}</p>
                    <p className="mt-2 text-body3 text-secondary">{t('addNewMcpsFromMarket')}</p>
                </div>
            ) : (
                <>
                    <section className={PROFILE_GRID_COLS}>
                        {list.map((item) => (
                            <ProfileCard
                                key={item.id}
                                item={item}
                                onClose={() => handleOpenDelete(item.id)}
                                onClickApiKey={(pf, mid) => handleOpenApiKey(pf, mid)} // ✅ pf는 문자열이어야 함
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
                                {t('previous')}
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
                                {t('next')}
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

            {/* ✅ 변경된 모달: platformId만 전달 */}
            <ApiKeyFlowModal
                isOpen={isApiModalOpen}
                onClose={handleCloseApiKey}
                platformId={selectedPlatformId || ""}  // ✅ 문자열 보장
            />
        </section>
    );
};

export default ProfilePage;
