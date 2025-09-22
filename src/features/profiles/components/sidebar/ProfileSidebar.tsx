// src/features/profiles/components/sidebar/ProfileSidebar.tsx
"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { SidebarKeyType } from "./constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import { useRouter } from "next/navigation";

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
        // 필요하다면 로그아웃 로직 실행 후
        onClickLogout?.();
        router.push("/ko"); // ✅ 여기로 이동
    };

    const [openDelete, setOpenDelete] = React.useState(false);

    // 실제 API 호출부는 분리: 예측 가능성↑, 테스트 용이
    const requestDelete = async () => {
        // TODO: 탈퇴 API 호출
        // await fetch("/api/account", { method: "DELETE" });
        // 데모 지연
        await new Promise((r) => setTimeout(r, 600));
    };

    return (
        <aside className="w-full max-w-[280px] px-6 py-8 flex h-full flex-col">
            <SidebarHeader username={username} />
            <SidebarNav activeKey={activeKey} />

            <div className="mt-auto pt-6 space-y-3">
                <PrimaryButton
                    size="md"
                    className="w-full justify-center"
                    onClick={handleLogout}
                >
                    Log Out
                </PrimaryButton>

                <PrimaryButton
                    size="md"
                    className="w-full justify-center"
                    onClick={() => setOpenDelete(true)}
                >
                    Delete Account
                </PrimaryButton>
            </div>


            <DeleteAccountModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onRequestDelete={requestDelete}
            />
        </aside>
    );
};

export default ProfileSidebar;
