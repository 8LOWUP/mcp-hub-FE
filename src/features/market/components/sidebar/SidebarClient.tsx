// features/market/components/sidebar/SidebarClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_PRESET } from "@/features/market/constants";
import { FaLayerGroup } from "react-icons/fa";

const SidebarClient: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
    const pathname = usePathname();                   // e.g. "/ko/market"
    const sp = useSearchParams();
    const active = (sp.get("cat") ?? "all").toLowerCase();

    // 현재 로케일 추출
    const locale = React.useMemo(() => pathname.split("/")[1] || "en", [pathname]);

    return (
        <nav aria-label="Market sidebar" className="px-4 py-15 space-y-10">
            <div className="flex items-center gap-3">
                <FaLayerGroup size={22} className="opacity-80 text-secondary" />
                <h3 className="text-[20px] font-semibold text-primary">Categories</h3>
            </div>

            <section>
                <div className="flex flex-col gap-2">
                    {CATEGORY_PRESET.map((c) => {
                        const href =
                            c.id === "all"
                                ? `/${locale}/market`
                                : `/${locale}/market?cat=${c.id}`;

                        const isActive = active === c.id;

                        return (
                            <Link
                                key={c.id}
                                href={href}
                                prefetch={false}
                                scroll={false}
                                replace
                                className={[
                                    "flex items-center gap-3 rounded-[10px] px-3 py-2 text-body3 transition-colors",
                                    isActive
                                        ? "bg-transparent ring-1 ring-accent/70 text-primary"
                                        : "text-secondary hover:bg-surface-2",
                                ].join(" ")}
                                onClick={onItemClick}
                            >
                                <c.icon size={18} className="opacity-80 shrink-0" />
                                <span className="text-[15px]">{c.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </nav>
    );
};

export default SidebarClient;
