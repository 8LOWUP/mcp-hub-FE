"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { SidebarKeyType } from "./constants";

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
        <aside className="w-full max-w-[280px] space-y-8 px-6 py-8">
            <SidebarHeader username={username} />

            <SidebarNav activeKey={activeKey} />

            <div className="mt-10 space-y-3">
                <button
                    type="button"
                    onClick={onClickLogout}
                    className="w-full rounded-xl bg-[#FFE970] px-5 py-3 text-lg font-semibold text-black"
                >
                    Log Out
                </button>
                <button
                    type="button"
                    onClick={onClickDelete}
                    className="w-full rounded-xl bg-[#FFE970] px-5 py-3 text-lg font-semibold text-black"
                >
                    Delete Account
                </button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
