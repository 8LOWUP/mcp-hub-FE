// src/features/profiles/components/ProfileCard.tsx
"use client";

import React from "react";
import { McpItemType } from "../types";
import { PROFILES_STYLES } from "../constants";
import SecondaryButton from "@/components/ui/SecondaryButton";

const publicPrefix = process.env.NEXT_PUBLIC_BASE_PATH || "";

type ProfileCardProps = {
    item: McpItemType;
    onClickApiKey?: (id: string) => void;
    onClose?: (id: string) => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onClickApiKey, onClose }) => {
    const handleClickApiKey = () => onClickApiKey?.(item.id);
    const handleClose = () => onClose?.(item.id);

    return (
        <article
            className={[
                PROFILES_STYLES.CARD_BASE,
                item.isHighlighted
                    ? PROFILES_STYLES.CARD_BORDER_HIGHLIGHT
                    : PROFILES_STYLES.CARD_BORDER_DEFAULT,
                "hover:border-transparent hover:bg-surface-2 active:bg-surface-2 cursor-pointer transition-colors"
            ].join(" ")}
            aria-label={`${item.title} 카드`}
        >
            <div className="flex items-start justify-between">
                <h2 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h2>

                <button
                    aria-label="카드 닫기"
                    onClick={handleClose} // onClose 없으면 undefined → noop
                    className="ml-2 hover:opacity-80 transition-opacity shrink-0"
                >
                    <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 block"
                    >
                        <path d="M1 19L17 1M17 19L1 1" stroke="#F6E577" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>

            <div className={PROFILES_STYLES.CARD_ACTIONS}>
                <SecondaryButton variant="secondary" size="sm" onClick={handleClickApiKey}>
                    API Key
                </SecondaryButton>
            </div>
        </article>
    );
};

export default ProfileCard;
