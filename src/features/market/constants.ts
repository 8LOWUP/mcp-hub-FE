// features/market/constants.ts
import type { IconType } from "react-icons";
import {
    FaGlobe,
    FaCube,
    FaWindowMaximize,
    FaLanguage,
    FaEllipsisH,
    FaThLarge,
} from "react-icons/fa";

export type CategoryItem = {
    id: "all" | "memory" | "web-search" | "browser" | "language" | "etc";
    label: string;
    icon: IconType; // react-icons 컴포넌트 타입
};

export const CATEGORY_PRESET: CategoryItem[] = [
    { id: "all",        label: "All",        icon: FaThLarge },
    { id: "memory",     label: "Memory",     icon: FaCube },
    { id: "web-search", label: "Web search", icon: FaGlobe },
    { id: "browser",    label: "Browser",    icon: FaWindowMaximize },
    { id: "language",   label: "Language",   icon: FaLanguage },
    { id: "etc",        label: "Etc",        icon: FaEllipsisH },
];

export type CategoryId = CategoryItem["id"];
export const DEFAULT_PAGE_SIZE = 24;
