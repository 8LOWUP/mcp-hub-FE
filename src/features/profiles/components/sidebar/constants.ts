import { MonitorPlay, Package, HelpCircle } from "lucide-react";

export type SidebarKeyType = "stored" | "deployed" | "support";

export type SidebarItemType = {
    key: SidebarKeyType;
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const PROFILE_NAV_ITEMS: SidebarItemType[] = [
    { key: "stored", label: "Stored MCP", href: "/profiles/stored", icon: MonitorPlay },
    { key: "deployed", label: "Deployed MCP", href: "/profiles/deployed", icon: Package },
    { key: "support", label: "Support", href: "/profiles/support", icon: HelpCircle },
] as const;
