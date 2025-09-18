// src/features/profiles/constants.ts
// 목적: 마이페이지(Profile) 화면에서 재사용할 그리드/스타일/더미데이터 상수

import { McpItemType } from "./types";

/* ================================
 * 레이아웃/그리드
 * ================================ */
export const PROFILE_GRID_COLS = "grid grid-cols-1 sm:grid-cols-2 gap-6";

/* ================================
 * 테마 토큰 (클래스 기반)
 * - 배경/텍스트/보더는 모두 공통 변수로 관리
 * ================================ */
export const THEME_CLASSES = {
    // 배경(surface 계층)
    PAGE_BG: "bg-surface-1",
    CONTAINER_BG: "bg-surface-1", // 카드/패널 기본 배경
    // 텍스트
    TEXT_PRIMARY: "text-primary",
    TEXT_SECONDARY: "text-secondary",
    TEXT_MUTED: "text-muted",
    // 보더
    BORDER_DEFAULT: "border-muted",
    BORDER_CONTRAST: "border-contrast",
    BORDER_ACCENT: "border-accent",
    // 액센트
    BG_ACCENT: "bg-accent",
    BG_ACCENT_HOVER: "hover:bg-accent-hover",
} as const;

/* ================================
 * 공통 스타일 (Tailwind Class 집합)
 * ================================ */
export const PROFILES_STYLES = {
    PAGE_PADDING: "p-6 md:p-8",
    HEADER_TITLE: "text-title2",
    HEADER_SUBTITLE: `${THEME_CLASSES.TEXT_SECONDARY} text-body3 mt-1`,

    // 카드
    CARD_BASE: `rounded-[20px] p-6 border ${THEME_CLASSES.CONTAINER_BG}`,
    CARD_BORDER_DEFAULT: `${THEME_CLASSES.BORDER_ACCENT}`,
    CARD_BORDER_HIGHLIGHT: `${THEME_CLASSES.BORDER_ACCENT}`,
    CARD_TITLE: `text-lg font-semibold ${THEME_CLASSES.TEXT_PRIMARY}`,
    CARD_DESC: `mt-3 text-sm ${THEME_CLASSES.TEXT_SECONDARY}`,
    CARD_ACTIONS: "mt-5 flex justify-end",

    // 버튼(예: API Key)
    API_BUTTON: `rounded-full px-4 py-2 text-sm font-medium text-black ${THEME_CLASSES.BG_ACCENT} ${THEME_CLASSES.BG_ACCENT_HOVER}`,
} as const;

/* ================================
 * 더미 데이터 (API 연동 전 스켈레톤용)
 * ================================ */
export const DUMMY_MCP_LIST: McpItemType[] = [
    {
        id: "notion-1",
        title: "Notion’s MCP",
        description: "mcp에 대한 상세 설명이 이곳에 들어옵니다!!!",
    },
    {
        id: "notion-2",
        title: "Notion’s MCP",
        description: "mcp에 대한 상세 설명이 이곳에 들어옵니다!!!",
    },
    {
        id: "notion-3",
        title: "Notion’s MCP",
        description: "mcp에 대한 상세 설명이 이곳에 들어옵니다!!!",
    },
    {
        id: "notion-4",
        title: "Notion’s MCP",
        description: "mcp에 대한 상세 설명이 이곳에 들어옵니다!!!",
    },
];
