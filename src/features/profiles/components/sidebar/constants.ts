// src/features/profiles/components/sidebar/constants.ts
import { MonitorPlay, Package, Key } from "lucide-react";

export type SidebarKeyType = "stored" | "deployed" | "llmManage";

export const ROUTES = {
    profiles: "/profiles",
    deployed: "/profiles/deployed",
    llmManage:  "/profiles/llm-manage",
} as const;

export type SidebarItem = {
    key: SidebarKeyType;
    label: string;
    href: string; // locale 없음
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const PROFILE_NAV_ITEMS: SidebarItem[] = [
    { key: "stored",   label: "storedMcp",   href: ROUTES.profiles, icon: MonitorPlay },
    { key: "deployed", label: "deployedMcp", href: ROUTES.deployed, icon: Package },
    { key: "llmManage",   label: "llmTokens",   href: ROUTES.llmManage,   icon: Key },
];
