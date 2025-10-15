"use client";

import React from "react";
import { McpItemType } from "../../types/mcps";
import { PROFILES_STYLES } from "../../constants";
import SecondaryButton from "@/components/ui/SecondaryButton";

type ProfileCardProps = {
    item: McpItemType;
    /** platformId가 없을 수도 있으므로 null 허용 + mcpId까지 넘김 */
    onClickApiKey?: (platformId: string | null, mcpId: number) => void;
    onClose?: (id: string) => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onClickApiKey, onClose }) => {
    const handleClickApiKey = () => {
        // mcpId 없으면 id(문자열)를 숫자로 변환해서 사용
        const mid = item.mcpId ?? Number(item.id);
        const pf = item.platformId || null;

        if (!mid || Number.isNaN(mid)) {
            console.warn("[CARD] invalid mcpId (item.id, item.mcpId):", { id: item.id, mcpId: item.mcpId });
            return; // 안전장치
        }

        onClickApiKey?.(pf, mid);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose?.(item.id);
    };

    // ✅ mcpId가 없으면 id를 숫자로 변환해서 disabled 판단
    const computedMcpId = item.mcpId ?? Number(item.id);
    const isApiKeyDisabled = !computedMcpId || Number.isNaN(computedMcpId);

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
            <div className="flex items-start justify-between">
                <h2 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h2>
                <button
                    type="button"
                    aria-label="카드 닫기"
                    onClick={handleClose}
                    className="ml-2 shrink-0 transition-opacity hover:opacity-80"
                >
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="block h-5 w-5">
                        <path d="M1 19L17 1M17 19L1 1" stroke="#F6E577" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {item.description && <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>}

            <div className={PROFILES_STYLES.CARD_ACTIONS}>
                <div onClickCapture={(e) => e.stopPropagation()}>
                    <SecondaryButton
                        variant="secondary"
                        size="sm"
                        hoverOnly
                        onClick={handleClickApiKey}
                        disabled={isApiKeyDisabled}
                    >
                        API Key
                    </SecondaryButton>
                </div>
            </div>
        </article>
    );
};

export default ProfileCard;
