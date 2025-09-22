// src/features/profiles/components/sidebar/constants.ts
import { MonitorPlay, Package, HelpCircle } from "lucide-react";

export type SidebarKeyType = "stored" | "deployed" | "support";

export const ROUTES = {
    profiles: "/profiles",
    deployed: "/profiles/deployed",
    support:  "/profiles/support",
} as const;

export type SidebarItem = {
    key: SidebarKeyType;
    label: string;
    href: string; // locale 없음
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const PROFILE_NAV_ITEMS: SidebarItem[] = [
    { key: "stored",   label: "Stored MCP",   href: ROUTES.profiles, icon: MonitorPlay },
    { key: "deployed", label: "Deployed MCP", href: ROUTES.deployed, icon: Package },
    { key: "support",  label: "Support",      href: ROUTES.support,  icon: HelpCircle },
];
