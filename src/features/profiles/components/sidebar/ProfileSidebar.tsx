"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { SidebarKeyType } from "./constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import EditProfileModal from "../modals/EditProfileModal";
import { useRouter } from "next/navigation";

// ✅ 프로필 API 훅
import { useMyProfile } from "@/hooks/profiles/useMyProfile";
// (선택) 탈퇴 훅이 이미 있다면 교체 가능
// import { useDeleteMe } from "@/hooks/profiles/useDeleteMe";

type ProfileSidebarProps = {
    activeKey: SidebarKeyType;
    username?: string;
    onClickLogout?: () => void;
    onClickDelete?: () => void;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
                                                           activeKey,
                                                           username = "USER",
                                                           onClickLogout,
                                                           onClickDelete,
                                                       }) => {
    const router = useRouter();

    const handleLogout = () => {
        onClickLogout?.();
        router.push("/ko");
    };

    // ✅ 프로필 훅 (기본값: 헤더 표시용 + 수정 기본값)
    const { profile, updateProfile } = useMyProfile();

    // ======= Delete modal =======
    const [openDelete, setOpenDelete] = React.useState(false);
    const requestDelete = async () => {
        // TODO: 탈퇴 API 호출(useDeleteMe 사용 권장)
        await new Promise((r) => setTimeout(r, 600));
        onClickDelete?.();
    };

    // ======= Edit modal =======
    const [openEdit, setOpenEdit] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmitEdit = async (values: { email: string; nickname: string }) => {
        try {
            setSubmitting(true);
            // 스웨거 상 PATCH /members/me
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
                {/* ✅ Edit Profile */}
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
                >
                    Delete Account
                </PrimaryButton>
            </div>

            {/* 탈퇴 모달 */}
            <DeleteAccountModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onRequestDelete={requestDelete}
            />

            {/* ✅ 프로필 수정 모달 */}
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
