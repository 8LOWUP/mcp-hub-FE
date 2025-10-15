import { generateSocialLoginUrl, extractCodeFromUrl, type SocialProvider } from "@/constants/auth/social-login";
import { apiService } from "@/services/api";
import { useLoginStore } from "@/store/login/login-store";
import type { User } from "@/store/login/login-store";

/* ================================
 * 서버 응답 타입 (스웨거 기준)
 * - member.picture 를 받아 FE store.User.avatarUrl 로 매핑
 * ================================ */
interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  member: {
    id: string;
    email: string;
    nickname: string;
    picture?: string; // ✅ 서버가 내려주는 프로필 이미지 URL
  };
}

/* ================================
 * 소셜 로그인 서비스
 * ================================ */
export class SocialLoginService {
  private static inProgress = false;

  /**
   * 소셜 로그인 페이지로 리다이렉트
   */
  static redirectToSocialLogin(provider: SocialProvider): void {
    try {
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      sessionStorage.setItem("returnUrl", currentUrl);
    } catch {
      // ignore
    }
    const loginUrl = generateSocialLoginUrl(provider);
    window.location.href = loginUrl;
  }

  /**
   * 현재 URL에서 authorization code를 추출하고 로그인 처리
   */
  static async handleSocialLoginCallback(): Promise<boolean> {
    if (this.inProgress) {
      console.log("⚠️ 이미 로그인 처리 중입니다.");
      return false;
    }

    const { setLoading, setError, clearError } = useLoginStore.getState();

    try {
      this.inProgress = true;
      setLoading(true);
      clearError();

      // 1) URL에서 code 추출
      const code = extractCodeFromUrl(window.location.href);
      console.log("🔍 URL에서 추출된 정보:", {
        url: window.location.href,
        code: code ? `${code}` : null,
        codeLength: code ? code.length : 0,
        searchParams: window.location.search,
      });

      if (!code) {
        throw new Error("Authorization code를 찾을 수 없습니다.");
      }

      // 2) 제공자 감지
      const provider = this.detectProviderFromUrl();
      console.log("🎯 제공자 감지 결과:", {
        provider,
        state: new URLSearchParams(window.location.search).get("state"),
        url: window.location.href,
      });

      if (!provider) {
        throw new Error("지원하지 않는 소셜 로그인 제공자입니다.");
      }

      // 3) 백엔드 교환
      console.log("[socialLogin] About to exchange code via API. Provider:", provider, "code len:", code.length);
      const response = await this.exchangeCodeForTokens(code, provider);
      console.log(
          "[socialLogin] Exchange finished. accessToken len:",
          response.accessToken.length,
          "refreshToken len:",
          response.refreshToken.length
      );

      // 4) FE User 매핑 (picture -> avatarUrl)
      const mappedUser: User = {
        id: String(response.member.id),
        email: response.member.email,
        nickname: response.member.nickname,
        avatarUrl: response.member.picture ?? undefined, // ✅ 핵심 매핑
      };

      // 5) 저장
      const { login } = useLoginStore.getState();
      login(mappedUser, response.accessToken, response.refreshToken);

      console.log("💾 로그인 정보 저장 완료:", {
        userId: mappedUser.id,
        userEmail: mappedUser.email,
        userName: mappedUser.nickname,
        hasAvatar: !!mappedUser.avatarUrl, // ✅ 필드명 통일
        accessTokenLength: response.accessToken.length,
        refreshTokenLength: response.refreshToken.length,
      });

      // 6) URL 정리
      this.cleanupUrl();

      // 7) 원래 페이지로 리다이렉트
      if (typeof window !== "undefined") {
        const returnUrl = sessionStorage.getItem("returnUrl");
        sessionStorage.removeItem("returnUrl");
        const redirectUrl = returnUrl || "/";
        console.log("🔄 로그인 성공! 리다이렉트 중...", { redirectUrl });
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }

      return true;
    } catch (error: any) {
      console.error("소셜 로그인 처리 오류:", error);
      const msg = error?.message || "로그인 중 오류가 발생했습니다.";
      setError(msg);
      return false;
    } finally {
      this.inProgress = false;
      setLoading(false);
    }
  }

  /**
   * URL에서 제공자 감지
   */
  private static detectProviderFromUrl(): SocialProvider | null {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state");
    if (state && ["google", "kakao", "github"].includes(state)) {
      return state as SocialProvider;
    }
    return null;
  }

  /**
   * Authorization code를 토큰으로 교환
   */
  private static async exchangeCodeForTokens(code: string, provider: SocialProvider): Promise<SocialLoginResponse> {
    try {
      console.log("🔄 토큰 교환 시작:", { provider, code });
      let response: any;

      switch (provider) {
        case "google":
          response = await apiService.auth.googleLogin(code);
          break;
        case "kakao":
          response = await apiService.auth.kakaoLogin(code);
          break;
        case "github":
          response = await apiService.auth.githubLogin(code);
          break;
        default:
          throw new Error(`지원하지 않는 제공자: ${provider}`);
      }

      console.log("📥 API 응답 받음:", response);

      // 공통 래핑 응답 가정: { code, message, result }
      if (response.code !== "COMMON200" || !response.result) {
        throw new Error("로그인 응답이 올바르지 않습니다.");
      }

      // 스웨거 스펙: result = { accessToken, refreshToken, member:{ id,email,nickname,picture } }
      return response.result as SocialLoginResponse;
    } catch (error: any) {
      console.error("토큰 교환 오류:", error);
      throw new Error(`로그인 처리 중 오류가 발생했습니다: ${error?.message ?? "unknown"}`);
    }
  }

  /**
   * URL에서 쿼리 정리
   */
  private static cleanupUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * 로그아웃 처리
   */
  static async logout(): Promise<void> {
    const { logout, setLoading, setError, refreshToken } = useLoginStore.getState();

    try {
      setLoading(true);
      // 서버 로그아웃 시 refreshToken 전달 (선택)
      const tokenToRevoke = refreshToken ?? undefined;
      await apiService.auth.logout(tokenToRevoke);
    } catch (error: any) {
      console.error("로그아웃 오류:", error);
      setError("로그아웃 중 오류가 발생했습니다.");
    } finally {
      logout();
      setLoading(false);
    }
  }

  /**
   * 토큰 갱신 (수동)
   */
  static async refreshAccessToken(): Promise<boolean> {
    const { refreshToken, setTokens, setError } = useLoginStore.getState();

    if (!refreshToken) {
      setError("리프레시 토큰이 없습니다.");
      return false;
    }

    try {
      console.log("🔄 수동 토큰 갱신 시도...");
      const response = await apiService.auth.reissueToken();

      if (response.success && response.result?.accessToken) {
        setTokens(response.result.accessToken, refreshToken);
        console.log("✅ 수동 토큰 갱신 성공");
        return true;
      }

      console.error("❌ 토큰 갱신 응답이 올바르지 않습니다:", response);
      return false;
    } catch (error: any) {
      console.error("❌ 수동 토큰 갱신 오류:", error);
      setError("토큰 갱신에 실패했습니다.");
      return false;
    }
  }
}

/* ================================
 * 편의 함수
 * ================================ */
export const socialLogin = {
  google: () => SocialLoginService.redirectToSocialLogin("google"),
  kakao: () => SocialLoginService.redirectToSocialLogin("kakao"),
  github: () => SocialLoginService.redirectToSocialLogin("github"),
  handleCallback: () => SocialLoginService.handleSocialLoginCallback(),
  logout: () => SocialLoginService.logout(),
  refreshToken: () => SocialLoginService.refreshAccessToken(),
};
