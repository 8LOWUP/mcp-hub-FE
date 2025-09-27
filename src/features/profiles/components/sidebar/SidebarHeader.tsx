"use client";

import React from "react";
import Image from "next/image";

type SidebarHeaderProps = {
    username: string;
    avatarSrc?: string;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ username, avatarSrc }) => {
    return (
        <header className="flex flex-col items-center gap-4 pb-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-[#E3E3E3]">
                {avatarSrc ? (
                    <Image src={avatarSrc} alt={`${username} avatar`} fill className="object-cover" />
                ) : (
                    <div className="grid h-full w-full place-items-center text-4xl">😼</div>
                )}
            </div>

            <button
                type="button"
                className="rounded-md border border-[#EDE7A0] px-6 py-2 text-lg font-bold tracking-wide text-[#EDE7A0]"
            >
                {username.toUpperCase()}
            </button>
        </header>
    );
};

export default SidebarHeader;
