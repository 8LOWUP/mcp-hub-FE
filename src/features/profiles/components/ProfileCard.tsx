// src/features/profiles/components/ProfileCard.tsx
"use client";

import React from "react";
import { McpItemType } from "../types";
import { PROFILES_STYLES } from "../constants";
import SecondaryButton from "@/components/ui/SecondaryButton";

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
            ].join(" ")}
            aria-label={`${item.title} 카드`}
        >
            <div className="flex items-start justify-between">
                <h2 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h2>

                {/* 닫기 아이콘 (옵션) */}
                {onClose && (
                    <button
                        aria-label="카드 닫기"
                        onClick={handleClose}
                        className="ml-2 text-gray-400 hover:text-gray-200"
                    >
                        ✕
                    </button>
                )}
            </div>

            <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>

            <div className={PROFILES_STYLES.CARD_ACTIONS}>
                <SecondaryButton
                    variant="secondary"
                    size="sm"
                    onClick={handleClickApiKey}
                >
                    API Key
                </SecondaryButton>
            </div>
        </article>
    );
};

export default ProfileCard;
