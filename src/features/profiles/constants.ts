/* ================================
 * 레이아웃/그리드
 * ================================ */
export const PROFILE_GRID_COLS = "grid grid-cols-1 sm:grid-cols-2 gap-6";

/* ================================
 * 테마 토큰 (클래스 기반)
 * ================================ */
export const THEME_CLASSES = {
    PAGE_BG: "bg-surface-1",
    CONTAINER_BG: "bg-surface-1",
    TEXT_PRIMARY: "text-primary",
    TEXT_SECONDARY: "text-secondary",
    TEXT_MUTED: "text-muted",
    BORDER_DEFAULT: "border-muted",
    BORDER_CONTRAST: "border-contrast",
    BORDER_ACCENT: "border-accent",
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

    CARD_BASE: `rounded-[20px] p-6 border ${THEME_CLASSES.CONTAINER_BG}`,
    CARD_BORDER_DEFAULT: `${THEME_CLASSES.BORDER_ACCENT}`,
    CARD_BORDER_HIGHLIGHT: `${THEME_CLASSES.BORDER_ACCENT}`,
    CARD_TITLE: `text-lg font-semibold ${THEME_CLASSES.TEXT_PRIMARY}`,
    CARD_DESC: `mt-3 text-sm ${THEME_CLASSES.TEXT_SECONDARY}`,
    CARD_ACTIONS: "mt-5 flex justify-end",
    CARD_FILL_BG_3: "border-0 !bg-[var(--bg-color-2)]",

    API_BUTTON: `rounded-full px-4 py-2 text-sm font-medium text-black ${THEME_CLASSES.BG_ACCENT} ${THEME_CLASSES.BG_ACCENT_HOVER}`,
} as const;
