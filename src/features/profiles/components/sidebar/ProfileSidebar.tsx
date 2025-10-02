// src/features/profiles/components/sidebar/ProfileSidebar.tsx
"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { SidebarKeyType } from "./constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import EditProfileModal from "../modals/EditProfileModal";
import { useRouter, usePathname } from "next/navigation";

// 프로필 훅
import { useMyProfile } from "@/hooks/profiles/useMyProfile";

// 프로필 전용 API에서 deleteMe 사용
import { deleteMe as deleteMyAccount } from "@/services/profiles/api";

// 토큰/세션 유틸
import { getRefreshToken, clearAuth } from "@/services/AxiosInstance";

type ProfileSidebarProps = {
    activeKey: SidebarKeyType;
    username?: string;
    onClickLogout?: () => void;
    onClickDelete?: () => void;
};

// 429의 Retry-After 헤더를 초 단위로 파싱(브라우저 측 보조)
const getRetryAfterSeconds = (err: any): number | null => {
    const h = err?.response?.headers;
    if (!h) return null;
    const ra = h["retry-after"] ?? h["Retry-After"];
    if (ra) {
        const n = Number(ra);
        if (Number.isFinite(n)) return Math.max(1, Math.ceil(n));
        const t = Date.parse(String(ra));
        if (Number.isFinite(t)) return Math.max(1, Math.ceil((t - Date.now()) / 1000));
    }
    return null;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
                                                           activeKey,
                                                           username = "USER",
                                                           onClickLogout,
                                                           onClickDelete,
                                                       }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            // 서버 로그아웃은 선택 사항
        } finally {
            await clearAuth?.();
            onClickLogout?.();
            const locale = pathname?.split("/")?.[1] || "ko";
            router.push(`/${locale}`);
        }
    };

    const { profile, updateProfile } = useMyProfile();

    // ======= Delete modal =======
    const [openDelete, setOpenDelete] = React.useState(false);
    const deletingRef = React.useRef(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const requestDelete = async () => {
        if (deletingRef.current) return; // ✅ 중복 호출 가드
        deletingRef.current = true;
        setIsDeleting(true);

        try {
            const rt = getRefreshToken?.();
            if (!rt) throw new Error("No refreshToken. Please re-login and try again.");

            // ✅ 성공 판정은 "에러가 안 던져지면 성공"(HTTP 2xx)으로만 판단
            await deleteMyAccount(rt);

            await clearAuth?.();

            const locale = pathname?.split("/")?.[1] || "ko";
            router.replace(`/${locale}`);

            onClickDelete?.();
        } catch (e: any) {
            console.error("Delete account failed:", e);

            // 429 세부 안내
            if (e?.response?.status === 429) {
                const s = getRetryAfterSeconds(e);
                if (s != null) {
                    alert(`요청이 너무 많습니다. 약 ${s}초 후 다시 시도해주세요.`);
                } else {
                    alert("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
                }
            } else {
                alert("회원탈퇴에 실패했습니다. 잠시 후 다시 시도하거나 재로그인 후 진행해주세요.");
            }
        } finally {
            setIsDeleting(false);
            deletingRef.current = false;
            setOpenDelete(false);
        }
    };

    // ======= Edit modal =======
    const [openEdit, setOpenEdit] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmitEdit = async (values: { email: string; nickname: string }) => {
        try {
            setSubmitting(true);
            await updateProfile({ email: values.email, nickname: values.nickname });
            setOpenEdit(false);
        } finally {
            setSubmitting(false);
        }
    };

    const displayName = profile?.nickname ?? username;

    return (
        <aside className="w-full max-w-[280px] px-6 py-8 flex h-full flex-col">
            <SidebarHeader username={displayName} />
            <SidebarNav activeKey={activeKey} />

            <div className="mt-auto pt-6 space-y-3">
                {/* Edit Profile */}
                <PrimaryButton
                    size="md"
                    additionalClassName="w-full justify-center"
                    onClick={() => setOpenEdit(true)}
                >
                    Edit Profile
                </PrimaryButton>

                <PrimaryButton
                    size="md"
                    additionalClassName="w-full justify-center"
                    onClick={handleLogout}
                >
                    Log Out
                </PrimaryButton>

                <PrimaryButton
                    size="md"
                    additionalClassName="w-full justify-center"
                    onClick={() => setOpenDelete(true)}
                    disabled={isDeleting} // 진행 중 비활성화
                >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                </PrimaryButton>
            </div>

            {/* 탈퇴 모달 */}
            <DeleteAccountModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onRequestDelete={requestDelete}
                // isSubmitting={isDeleting} // 컴포넌트가 지원하면 버튼 로딩 표시
            />

            {/* 프로필 수정 모달 */}
            <EditProfileModal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                isSubmitting={submitting}
                defaultValues={{
                    email: profile?.email ?? "",
                    nickname: profile?.nickname ?? "",
                }}
                onSubmit={handleSubmitEdit}
            />
        </aside>
    );
};

export default ProfileSidebar;
