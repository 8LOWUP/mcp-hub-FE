import { generateSocialLoginUrl, extractCodeFromUrl, type SocialProvider } from "@/constants/auth/social-login";
import { apiService } from "@/services/api";
import { useLoginStore } from "@/store/login/login-store";
import type { User } from "@/store/login/login-store";

/** 서버 공통 응답 언래핑 유틸: .result 가 있으면 그걸, 없으면 원본을 반환 */
function unwrapApi<T>(raw: unknown): T {
    const r = raw as Record<string, unknown> | null | undefined;
    if (r && typeof r === "object" && "result" in r) {
        return (r as { result: T }).result;
    }
    return raw as T;
}

/** 소셜 로그인 응답 타입 (실제 API 응답 구조에 맞춰 사용) */
interface SocialLoginResponse {
    accessToken: string;
    refreshToken: string;
    member: {
        id: string | number;
        email: string;
        nickname: string;
    };
}

/** 서버에서 최신 me를 가져와 User로 매핑 (항상 서버 소스 사용) */
const fetchMeFresh = async (): Promise<User> => {
    const res = await apiService.members.getMe();
    const me = unwrapApi<{ id: string | number; email: string; nickname: string }>(res);
    return {
        id: String(me.id),
        email: me.email,
        nickname: me.nickname,
    };
};

export class SocialLoginService {
    private static inProgress = false;

    /** 소셜 로그인 페이지로 리다이렉트 */
    static redirectToSocialLogin(provider: SocialProvider): void {
        try {
            const currentUrl = window.location.pathname + window.location.search + window.location.hash;
            sessionStorage.setItem("returnUrl", currentUrl);
        } catch {
            /* noop */
        }
        const loginUrl = generateSocialLoginUrl(provider);
        window.location.href = loginUrl;
    }

    /**
     * 콜백 처리:
     * - code 교환 → 토큰 setTokens
     * - 서버 GET /members/me 로 최신 유저 확보 (탈퇴 후 재가입 시 신규 row 확보)
     * - 실패 시 응답의 member로 폴백
     */
    static async handleSocialLoginCallback(): Promise<boolean> {
        if (this.inProgress) {
            console.log("⚠️ 이미 로그인 처리 중입니다.");
            return false;
        }

        const { setLoading, setError, clearError, setTokens, login } = useLoginStore.getState();

        try {
            this.inProgress = true;
            setLoading(true);
            clearError();

            const code = extractCodeFromUrl(window.location.href);
            if (!code) throw new Error("Authorization code를 찾을 수 없습니다.");

            const provider = this.detectProviderFromUrl();
            if (!provider) throw new Error("지원하지 않는 소셜 로그인 제공자입니다.");

            // 1) code → token 교환
            const exchanged = await this.exchangeCodeForTokens(code, provider); // SocialLoginResponse

            // 2) 토큰 우선 저장(이후 me 호출이 인증됨)
            try {
                setTokens?.(exchanged.accessToken, exchanged.refreshToken);
            } catch {
                /* store 구조에 따라 없을 수 있음 */
            }

            // 3) 항상 서버에서 me fresh
            let finalUser: User;
            try {
                finalUser = await fetchMeFresh();
            } catch (e: unknown) {
                console.warn("⚠️ me fresh fetch 실패, 로그인 응답 member 사용:", e);
                finalUser = {
                    id: String(exchanged.member.id),
                    email: exchanged.member.email,
                    nickname: exchanged.member.nickname,
                };
            }

            // 4) 스토어에 최종 로그인 정보 저장
            login(finalUser, exchanged.accessToken, exchanged.refreshToken);

            // URL 정리
            this.cleanupUrl();

            // 리다이렉트
            if (typeof window !== "undefined") {
                const returnUrl = sessionStorage.getItem("returnUrl");
                sessionStorage.removeItem("returnUrl");
                const redirectUrl = returnUrl || "/";
                setTimeout(() => (window.location.href = redirectUrl), 500);
            }

            return true;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
            console.error("소셜 로그인 처리 오류:", err);
            setError(msg);
            return false;
        } finally {
            this.inProgress = false;
            setLoading(false);
        }
    }

    /** URL에서 제공자 감지 (OAuth state 활용) */
    private static detectProviderFromUrl(): SocialProvider | null {
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get("state");
        if (state && ["google", "kakao", "github"].includes(state)) {
            return state as SocialProvider;
        }
        return null;
    }

    /** Authorization code를 토큰으로 교환 → SocialLoginResponse */
    private static async exchangeCodeForTokens(code: string, provider: SocialProvider): Promise<SocialLoginResponse> {
        try {
            let res: unknown;
            switch (provider) {
                case "google":
                    res = await apiService.auth.googleLogin(code);
                    break;
                case "kakao":
                    res = await apiService.auth.kakaoLogin(code);
                    break;
                case "github":
                    res = await apiService.auth.githubLogin(code);
                    break;
                default:
                    throw new Error(`지원하지 않는 제공자: ${provider}`);
            }
            // 백엔드 공통 응답 포맷이 { code, result } 또는 직접 페이로드일 수 있음
            return unwrapApi<SocialLoginResponse>(res);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("토큰 교환 오류:", err);
            throw new Error(`로그인 처리 중 오류가 발생했습니다: ${msg}`);
        }
    }

    /** URL의 code/state 파라미터 제거 */
    private static cleanupUrl(): void {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, document.title, url.toString());
    }

    /** 로그아웃 */
    static async logout(): Promise<void> {
        const { logout, setLoading, setError, refreshToken } = useLoginStore.getState();
        try {
            setLoading(true);
            // 서버에 refreshToken 전달하여 세션 철회 (스토어 값 보존 상태에서 꺼내둔 사본 사용)
            const tokenToRevoke = refreshToken ?? undefined;
            await apiService.auth.logout(tokenToRevoke);
        } catch (err: unknown) {
            console.error("로그아웃 오류:", err);
            setError("로그아웃 중 오류가 발생했습니다.");
        } finally {
            // 로컬 스토리지/상태 정리
            logout();
            setLoading(false);
        }
    }

    /** 토큰 갱신 (백엔드 포맷: { result: { accessToken } } 포함 가정) */
    static async refreshAccessToken(): Promise<boolean> {
        const { refreshToken, setTokens, setError } = useLoginStore.getState();
        if (!refreshToken) {
            setError("리프레시 토큰이 없습니다.");
            return false;
        }
        try {
            const res = await apiService.auth.reissueToken();
            // 서버가 { success, result: { accessToken } } 혹은 직접 페이로드를 줄 수 있으므로 언래핑
            const payload = unwrapApi<{ accessToken: string }>(res);
            if (payload?.accessToken) {
                setTokens?.(payload.accessToken, refreshToken);
                return true;
            }
            return false;
        } catch (err: unknown) {
            console.error("토큰 갱신 오류:", err);
            setError("토큰 갱신에 실패했습니다.");
            return false;
        }
    }
}

/** 편의 함수 */
export const socialLogin = {
    google: () => SocialLoginService.redirectToSocialLogin("google"),
    kakao: () => SocialLoginService.redirectToSocialLogin("kakao"),
    github: () => SocialLoginService.redirectToSocialLogin("github"),
    handleCallback: () => SocialLoginService.handleSocialLoginCallback(),
    logout: () => SocialLoginService.logout(),
    refreshToken: () => SocialLoginService.refreshAccessToken(),
};
