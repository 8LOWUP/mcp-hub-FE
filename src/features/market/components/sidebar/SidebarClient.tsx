"use client";

import React from "react";
import Link from "next/link";
import { CATEGORY_PRESET } from "@/features/market/constants";

type Props = { onItemClick?: () => void };

const itemCls =
    "flex items-center gap-3 rounded-[10px] px-3 py-2 text-body3 hover:bg-surface-2 transition-colors";

const SidebarClient: React.FC<Props> = ({ onItemClick }) => {
    return (
        <nav aria-label="Market sidebar" className="px-4 py-6 space-y-6">
            <section>
                <h3 className="text-body4 text-secondary mb-2">Categories</h3>
                <div className="flex flex-col gap-1">
                    {CATEGORY_PRESET.map((c) => {
                        const Icon = c.icon; // ✅ 아이콘 컴포넌트 꺼내기
                        return (
                            <Link
                                key={c.id}
                                href={c.id === "all" ? "/market" : `/market?cat=${c.id}`}
                                className={itemCls}
                                onClick={onItemClick}
                            >
                                <Icon size={18} className="opacity-80 shrink-0" /> {/* ✅ 아이콘 렌더 */}
                                <span>{c.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </nav>
    );
};

export default SidebarClient;
