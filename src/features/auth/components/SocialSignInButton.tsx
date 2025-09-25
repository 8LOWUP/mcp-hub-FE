"use client";
import React from "react";
import Image from "next/image";
import { PROVIDER_LABEL, ProviderId } from "@/features/auth/constants";

const ICON_SRC: Record<ProviderId, string> = {
    google: "/icons/google.svg",
    github: "/icons/github.svg",
    kakao:  "/icons/kakao.svg",
};

type Props = { provider: ProviderId; onClick: (p: ProviderId) => void; disabled?: boolean; };

const SocialSignInButton: React.FC<Props> = ({ provider, onClick, disabled }) => {
    const handleClick = () => !disabled && onClick(provider);

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={[
                "w-full h-14 rounded-2xl border",
                "bg-surface-1 border-contrast text-primary",
                "hover:bg-surface-2 active:bg-surface-2",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "transition-colors flex items-center justify-center gap-3",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
            aria-label={PROVIDER_LABEL[provider]}
        >
            <Image src={ICON_SRC[provider]} alt="" width={22} height={22} />
            <span className="text-body3">{PROVIDER_LABEL[provider]}</span>
        </button>
    );
};

export default SocialSignInButton;
