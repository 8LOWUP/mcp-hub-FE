// 공개/보호 규칙은 "locale 제거한 경로" 기준으로 정의
export const SUPPORTED_LOCALES = ["ko", "en"] as const;
export type LocaleType = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: LocaleType = "ko";

export const LOGIN_BASE_PATH = "/login";
export const AFTER_LOGIN_DEFAULT_BASE_PATH = "/market";

// 공개 경로 (베이스 + prefix) — 상세까지 공개 처리
export const PUBLIC_BASE_PATHS: string[] = ["/", "/market"];           // 정확히 일치용
export const PUBLIC_PREFIXES: string[] = ["/market"];                   // ex) /market/123

// 보호 prefix (locale 제거한 경로 기준) ✅ 오타 수정 + 업로드 추가
export const PROTECTED_BASE_PREFIXES: string[] = ["/chat", "/profiles", "/upload"];

export const stripLocale = (pathname: string): { locale: LocaleType; basePath: string } => {
    const parts = pathname.split("/").filter(Boolean);
    const maybeLocale = parts[0];
    const locale = SUPPORTED_LOCALES.includes(maybeLocale as LocaleType)
        ? (maybeLocale as LocaleType)
        : DEFAULT_LOCALE;

    const basePath = SUPPORTED_LOCALES.includes(maybeLocale as LocaleType)
        ? "/" + parts.slice(1).join("/")
        : "/" + parts.join("/");

    return { locale, basePath: basePath === "//" ? "/" : basePath || "/" };
};

export const withLocale = (basePath: string, locale: LocaleType): string => {
    const clean = basePath.startsWith("/") ? basePath : `/${basePath}`;
    return `/${locale}${clean === "/" ? "" : clean}`;
};

export const isPublicBasePath = (basePath: string): boolean => {
    if (PUBLIC_BASE_PATHS.includes(basePath)) return true;
    return PUBLIC_PREFIXES.some((prefix) => basePath.startsWith(prefix));
};

export const isProtectedBasePath = (basePath: string): boolean =>
    PROTECTED_BASE_PREFIXES.some((prefix) => basePath.startsWith(prefix));
