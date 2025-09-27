"use client";

import React from "react";
import { McpItemType } from "../../types";
import { PROFILES_STYLES } from "../../constants";
import SecondaryButton from "@/components/ui/SecondaryButton";

type ProfileCardProps = {
    item: McpItemType;
    onClickApiKey?: (id: string) => void;
    onClose?: (id: string) => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                     item,
                                                     onClickApiKey,
                                                     onClose,
                                                 }) => {
    const handleClickApiKey = () => {
        // 버튼 클릭 시 포커스 잔상 제거
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
        onClickApiKey?.(item.id);
    };

    const handleClose = () => {
        onClose?.(item.id);
    };

    return (
        <article
            className={[
                PROFILES_STYLES.CARD_BASE,
                PROFILES_STYLES.CARD_BORDER_HIGHLIGHT,
                "hover:border-transparent hover:bg-surface-2 active:bg-surface-2",
                "cursor-pointer transition-colors",
            ].join(" ")}
            aria-label={`${item.title} 카드`}
        >
            {/* 헤더: 타이틀 + 닫기 버튼 */}
            <div className="flex items-start justify-between">
                <h2 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h2>

                <button
                    type="button"
                    aria-label="카드 닫기"
                    onClick={handleClose}
                    className="ml-2 shrink-0 transition-opacity hover:opacity-80"
                >
                    <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="block h-5 w-5"
                    >
                        <path
                            d="M1 19L17 1M17 19L1 1"
                            stroke="#F6E577"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            {/* 설명 */}
            {item.description && (
                <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>
            )}

            {/* 하단 액션 */}
            <div className={PROFILES_STYLES.CARD_ACTIONS}>
                <SecondaryButton
                    variant="secondary"
                    size="sm"
                    hoverOnly
                    onClick={handleClickApiKey}
                >
                    API Key
                </SecondaryButton>
            </div>
        </article>
    );
};

export default ProfileCard;
