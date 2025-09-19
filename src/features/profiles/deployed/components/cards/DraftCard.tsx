"use client";

import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { McpItemType } from "@/features/profiles/types";
import { PROFILES_STYLES } from "@/features/profiles/constants";

type DraftCardProps = {
    item: McpItemType;
    onEdit?: (id: string) => void;
};

const DraftCard: React.FC<DraftCardProps> = ({ item, onEdit }) => {
    const handleEdit = () => onEdit?.(item.id);

    return (
        <article
            className={[
                PROFILES_STYLES.CARD_BASE,
                PROFILES_STYLES.CARD_BORDER_HIGHLIGHT,
                "hover:bg-surface-2 transition-colors",
            ].join(" ")}
            aria-label={`${item.title} 임시저장 카드`}
        >
            <div className="flex items-start justify-between">
                <h3 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h3>

                <PrimaryButton size="sm" onClick={handleEdit}>Edit</PrimaryButton>
            </div>

            {item.description && (
                <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>
            )}
        </article>
    );
};

export default DraftCard;
