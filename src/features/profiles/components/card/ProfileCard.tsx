"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { McpItemType } from "../../types/mcps";
import { PROFILES_STYLES } from "../../constants";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { processMcpImageUrl } from "@/utils/imageUtils";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";

type ProfileCardProps = {
    item: McpItemType;
    /** platformId가 없을 수도 있으므로 null 허용 + mcpId까지 넘김 */
    onClickApiKey?: (platformId: string | null, mcpId: number) => void;
    onClose?: (id: string) => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onClickApiKey, onClose }) => {
    // Locale translations
    const t = useTranslations('ProfilePage');
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";
    const [imageError, setImageError] = useState(false);

    const mcpId = item.mcpId ?? Number(item.id);

    const handleOpenDetail = () => {
        if (!mcpId || Number.isNaN(mcpId)) {
            console.warn("[CARD] invalid mcpId:", { id: item.id, mcpId: item.mcpId });
            return;
        }
        router.push(`/${locale}/detail/${mcpId}`);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenDetail();
        }
    };

    const handleClickApiKey = () => {
        if (!mcpId || Number.isNaN(mcpId)) {
            console.warn("[CARD/APIKEY] invalid mcpId:", { id: item.id, mcpId: item.mcpId });
            return;
        }
        onClickApiKey?.(item.platformId ?? null, mcpId);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose?.(item.id);
    };


    const safeIconSrc = processMcpImageUrl(item.imageUrl) || "/default-mcp-logo.svg";
    
    return (
        <article
            onClick={handleOpenDetail}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            className={[
                PROFILES_STYLES.CARD_BASE,
                PROFILES_STYLES.CARD_BORDER_HIGHLIGHT,
                "hover:border-transparent hover:bg-surface-2 active:bg-surface-2",
                "cursor-pointer transition-colors outline-none bg-surface-6",
                "focus:ring-2 focus:ring-yellow-300/60 rounded-xl",
            ].join(" ")}
            aria-label={`${item.title} ${t('card')}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {!imageError ? (
                        <Image
                            src={safeIconSrc}
                            alt={`${item.title} MCP Logo`}
                            width={35}
                            height={35}
                            className="w-11 h-11 ml-1 flex-shrink-0"
                            onError={() => setImageError(true)}
                            loader={imageLoader}
                            unoptimized
                        />
                    ) : (
                        <div className="w-11 h-11 ml-1 flex-shrink-0 flex items-center justify-center bg-surface-2 rounded text-xs text-secondary font-bold">
                            {item.title.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h2 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h2>
                </div>
               
                <button
                    type="button"
                    aria-label={t('closeCard')}
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
                <div onClick={(e) => e.stopPropagation()}>
                    <SecondaryButton variant="secondary" size="sm" hoverOnly onClick={handleClickApiKey}>
                        {t('apiKey')}
                    </SecondaryButton>
                </div>
            </div>
        </article>
    );
};

export default ProfileCard;
