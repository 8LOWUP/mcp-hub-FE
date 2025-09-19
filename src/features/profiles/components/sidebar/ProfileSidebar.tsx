// src/features/profiles/components/sidebar/ProfileSidebar.tsx
"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { SidebarKeyType } from "./constants";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
    return (
        <aside className="w-full max-w-[280px] px-6 py-8 flex h-full flex-col">
            <SidebarHeader username={username} />
            <SidebarNav activeKey={activeKey} />

            <div className="mt-auto pt-6 space-y-3">
                <PrimaryButton
                    size="md"
                    className="w-full justify-center"
                    onClick={onClickLogout}
                >
                    Log Out
                </PrimaryButton>

                <PrimaryButton
                    size="md"
                    className="w-full justify-center"
                    onClick={onClickDelete}
                >
                    Delete Account
                </PrimaryButton>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
