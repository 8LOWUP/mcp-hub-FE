"use client";

import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { McpItemType } from "@/features/profiles/types";
import { PROFILES_STYLES } from "@/features/profiles/constants";

type DeployedCardProps = {
    item: McpItemType;
    onDelete?: (id: string) => void;
};

const DeployedCard: React.FC<DeployedCardProps> = ({ item, onDelete }) => {
    const handleDelete = () => onDelete?.(item.id);

    return (
        <article className={[PROFILES_STYLES.CARD_BASE, PROFILES_STYLES.CARD_FILL_BG_3, "transition-colors"].join(" ")}>
            <div className="flex items-start justify-between">
                <h3 className={PROFILES_STYLES.CARD_TITLE}>{item.title}</h3>

                {/* 빨간 Delete 버튼 */}
                <PrimaryButton
                    size="sm"
                    onClick={handleDelete}
                    className="!bg-[#FF1212] opacity-60 text-white hover:opacity-90"
                >
                    Delete
                </PrimaryButton>
            </div>

            {item.description && (
                <p className={PROFILES_STYLES.CARD_DESC}>{item.description}</p>
            )}
        </article>
    );
};

export default DeployedCard;
