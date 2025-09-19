// src/features/profiles/utils/paths.ts
export const withLocale = (locale: string | undefined, path: string) =>
    locale ? `/${locale}${path}` : path;
