// /middleware.ts
import { NextResponse, NextRequest } from "next/server";
import {
    stripLocale,
    withLocale,
    LOGIN_BASE_PATH,
    isProtectedBasePath,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
} from "@/constants/routes";

/** 브라우저 선호도 기준으로 로케일 추정 (ko/en) */
function detectPreferredLocale(req: NextRequest): string {
    // 1) 쿠키 우선
    const cookieLocale = req.cookies.get("locale")?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) return cookieLocale;

    // 2) 쿼리스트링 ?lang=en 같은 수동 지정 허용 (있으면 쿠키로 굽고 다음 요청부터 유지)
    const lang = req.nextUrl.searchParams.get("lang");
    if (lang && SUPPORTED_LOCALES.includes(lang as any)) return lang;

    // 3) Accept-Language
    const header = req.headers.get("accept-language") || "";
    const langToken = header.split(",")[0]?.trim().toLowerCase(); // e.g. "en-US"
    const short = langToken.slice(0, 2); // "en"
    if (SUPPORTED_LOCALES.includes(short as any)) return short;

    // 4) 기본값
    return DEFAULT_LOCALE;
}

/** 서버에서 로그인 추정: 팀 정책에 맞게 조정 */
function hasAuthCookie(req: NextRequest): boolean {
    const access = req.cookies.get("accessToken")?.value;
    const refresh = req.cookies.get("refreshToken")?.value;
    return Boolean(access || refresh);
}

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    // 0) 정적/내부 자원은 패스 (config.matcher로도 걸러지지만 가독성 보강)
    // if (pathname.startsWith("/_next") || pathname.includes(".")) return NextResponse.next();

    // 1) 루트("/") → 선호 로케일로 리다이렉트
    if (pathname === "/") {
        const best = detectPreferredLocale(req);
        const url = req.nextUrl.clone();
        url.pathname = `/${best}`;
        // ?lang= 파라미터로 들어온 경우 locale 쿠키를 같이 세팅
        const res = NextResponse.redirect(url);
        const fromLang = req.nextUrl.searchParams.get("lang");
        if (fromLang && SUPPORTED_LOCALES.includes(fromLang as any)) {
            res.cookies.set("locale", fromLang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
        }
        return res;
    }

    // 2) 로케일 세그먼트 정규화/보정
    //    - /en-US/market → /en/market
    //    - /abc/market → /ko/market (지원 안 되는 로케일이면 기본값)
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
        const maybe = parts[0]?.toLowerCase();
        const normalized = SUPPORTED_LOCALES.includes(maybe as any) ? maybe : undefined;

        if (!normalized) {
            // 지원되지 않는 로케일이거나 누락된 케이스 → 감지해서 붙여주기
            const best = detectPreferredLocale(req);
            const rest = "/" + parts.join("/");
            const url = req.nextUrl.clone();
            url.pathname = `/${best}${rest.startsWith("//") ? "" : rest ? `/${parts.join("/")}` : ""}`;
            return NextResponse.redirect(url);
        }
    }

    // 3) 로그인/콜백은 항상 통과 (루프/404 방지)
    const { basePath } = stripLocale(pathname);
    if (basePath.startsWith("/login") || basePath.startsWith("/auth/callback")) {
        return NextResponse.next();
    }

    // 4) 보호 경로 guard (채팅/프로필/업로드)
    if (isProtectedBasePath(basePath) && !hasAuthCookie(req)) {
        const { locale } = stripLocale(pathname);
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = withLocale(LOGIN_BASE_PATH, locale);
        redirectUrl.searchParams.set("next", pathname + (req.nextUrl.search || ""));
        redirectUrl.searchParams.set("authRequired", "1");
        return NextResponse.redirect(redirectUrl);
    }

    // 5) ?lang=ko 같은 수동 전환이 붙어있다면 locale 쿠키를 저장 (UX 유지)
    const langParam = searchParams.get("lang");
    if (langParam && SUPPORTED_LOCALES.includes(langParam as any)) {
        const res = NextResponse.next();
        res.cookies.set("locale", langParam, { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return res;
    }

    return NextResponse.next();
}

export const config = {
    // 정적/파일/내부 제외
    matcher: ["/((?!_next|api|.*\\..*).*)"],
};
