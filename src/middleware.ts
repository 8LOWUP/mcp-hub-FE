import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl middleware 생성
const intlMiddleware = createIntlMiddleware(routing);

// 보호된 경로 목록
const PROTECTED_ROUTES = ["/chat", "/profiles", "/upload"];

// 로그인 상태 확인 (쿠키 기반)
function isLoggedIn(req: NextRequest): boolean {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const isLoggedIn = Boolean(accessToken || refreshToken);
    
    //console.log("🍪 쿠키 확인:", {
    //    accessToken: accessToken ? "존재함" : "없음",
    //    refreshToken: refreshToken ? "존재함" : "없음",
    //    isLoggedIn,
    //    allCookies: req.cookies.getAll().map(c => c.name)
    //});
    
    // 🧪 테스트용: 강제로 로그아웃 상태로 시뮬레이션 (비활성화)
    // if (req.nextUrl.pathname.includes("/chat")) {
    //     console.log("🧪 테스트: /chat 경로는 강제로 로그아웃 상태로 처리");
    //     return false;
    // }
    
    return isLoggedIn;
}

// 보호된 경로인지 확인
function isProtectedRoute(pathname: string): boolean {
    // locale 제거 (예: /ko/chat -> /chat)
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';
    return PROTECTED_ROUTES.some(route => pathWithoutLocale.startsWith(route));
}

// locale 추출
function getLocale(pathname: string): string {
    const match = pathname.match(/^\/(ko|en)/);
    return match ? match[1] : 'ko';
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. 정적 파일, API 경로는 패스
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/__api") ||
        pathname.includes(".")
    ) {
        console.log("⏭️ 정적/API 경로 패스:", pathname);
        return NextResponse.next();
    }

    // 2. 로그인/콜백 경로는 항상 통과 (국제화 처리 없이)
    if (pathname.includes("/login") || pathname.includes("/auth/callback")) {
        console.log("🔐 로그인/콜백 경로 통과:", pathname);
        return NextResponse.next();
    }

    // 3. 보호된 경로 체크
    if (isProtectedRoute(pathname)) {
        const loggedIn = isLoggedIn(req);
        //console.log("🛡️ 보호된 경로 접근:", { pathname, loggedIn });
        
        if (!loggedIn) {
            // 로그인하지 않은 경우 이전 페이지로 돌아가서 알림 표시
            const referer = req.headers.get("referer");
            const locale = getLocale(pathname);
            
            let redirectUrl: URL;
            
            if (referer && !referer.includes(pathname)) {
                // 이전 페이지가 있고, 현재 페이지와 다른 경우
                redirectUrl = new URL(referer);
                console.log("🔄 이전 페이지로 리다이렉트:", referer);
            } else {
                // 이전 페이지가 없거나 같은 경우 홈으로
                redirectUrl = new URL(`/${locale}`, req.url);
                console.log("🏠 홈으로 리다이렉트:", redirectUrl.toString());
            }
            
            // 알림 파라미터 추가
            redirectUrl.searchParams.set("authRequired", "1");
            redirectUrl.searchParams.set("redirectTo", pathname);
            
            console.log("🔒 로그인 필요 - 리다이렉트:", redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    }

    // 4. 국제화 처리
    return intlMiddleware(req);
}

export const config = {
    matcher: [
        // 모든 경로에서 실행 (정적 파일, API는 내부에서 제외)
        '/((?!_next|_vercel|api|__api|.*\\..*).*)'
    ],
};