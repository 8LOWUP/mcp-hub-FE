"use client";

import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { McpItemType } from "@/features/profiles/types";
import { PROFILES_STYLES } from "@/features/profiles/constants";

type DraftCardProps = {
    item: McpItemType;
    onEdit?: (mcpId: number) => void; // 숫자 mcpId
};

const DraftCard: React.FC<DraftCardProps> = ({ item, onEdit }) => {
    const handleEdit = () => {
        if (!onEdit) return;
        onEdit(item.mcpId); // ✅ 문자열 id 대신 숫자 mcpId 전달
    };

    return (
        <article
            className={[
                PROFILES_STYLES.CARD_BASE,
                PROFILES_STYLES.CARD_FILL_BG_3,
                "transition-colors",
            ].join(" ")}
        >
            <div className="flex items-start justify-between">
                <h3 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h3>
                <PrimaryButton size="sm" onClick={handleEdit}>
                    Edit
                </PrimaryButton>
            </div>

            {item.description && (
                <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>
            )}
        </article>
    );
};

export default DraftCard;
