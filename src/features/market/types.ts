import type { CategoryId } from "./constants";

export type McpCardData = {
    id: string;
    title: string;
    description: string;
    iconSrc?: string;
    saved?: boolean;
    usersCount?: number;
    category: CategoryId;
};
