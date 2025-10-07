import { generateSocialLoginUrl, extractCodeFromUrl, type SocialProvider } from '@/constants/auth/social-login';
import { apiService } from '@/services/api';
import { useLoginStore } from '@/store/login/login-store';
import type { User } from '@/store/login/login-store';

// 소셜 로그인 응답 타입 (실제 API 응답 구조)
interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  member: {
    id: string;
    email: string;
    nickname: string;
  };
}

// 소셜 로그인 서비스 클래스
export class SocialLoginService {
  private static inProgress = false;

  /**
   * 소셜 로그인 페이지로 리다이렉트
   */
  static redirectToSocialLogin(provider: SocialProvider): void {
    // 현재 페이지를 로그인 후 돌아올 URL로 저장
    try {
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      sessionStorage.setItem('returnUrl', currentUrl);
    } catch (e) {
      // ignore
    }
    const loginUrl = generateSocialLoginUrl(provider);
    window.location.href = loginUrl;
  }

  /**
   * 현재 URL에서 authorization code를 추출하고 로그인 처리
   */
  static async handleSocialLoginCallback(): Promise<boolean> {
    // 중복 호출 방지
    if (this.inProgress) {
      console.log('⚠️ 이미 로그인 처리 중입니다.');
      return false;
    }

    const { setLoading, setError, clearError } = useLoginStore.getState();
    
    try {
      this.inProgress = true;
      setLoading(true);
      clearError();

      // URL에서 code 추출
      const code = extractCodeFromUrl(window.location.href);
      
      console.log('🔍 URL에서 추출된 정보:', {
        url: window.location.href,
        code: code ? `${code}` : null,
        codeLength: code ? code.length : 0,
        searchParams: window.location.search
      });
      
      if (!code) {
        throw new Error('Authorization code를 찾을 수 없습니다.');
      }

      // 제공자 확인 (URL에서 추출)
      const provider = this.detectProviderFromUrl();
      
      console.log('🎯 제공자 감지 결과:', {
        provider,
        state: new URLSearchParams(window.location.search).get('state'),
        url: window.location.href
      });
      
      if (!provider) {
        throw new Error('지원하지 않는 소셜 로그인 제공자입니다.');
      }

      // 백엔드에 code 전송하여 토큰 및 사용자 정보 받기
      console.log('[socialLogin] About to exchange code via API. Provider:', provider, 'code len:', code.length);
      const response = await this.exchangeCodeForTokens(code, provider);
      console.log('[socialLogin] Exchange finished. accessToken len:', response.accessToken.length, 'refreshToken len:', response.refreshToken.length);
      
      // API는 member를 반환하므로 우리 User 형태로 변환 후 저장
      const mappedUser: User = {
        id: String(response.member.id),
        email: response.member.email,
        nickname: response.member.nickname,
        // profileImage, createdAt, updatedAt 등은 API 응답에 없으므로 생략 또는 기본값
      };

      const { login } = useLoginStore.getState();
      login(mappedUser, response.accessToken, response.refreshToken);

      console.log('💾 로그인 정보 저장 완료:', {
        userId: mappedUser.id,
        userEmail: mappedUser.email,
        userName: mappedUser.nickname,
        accessTokenLength: response.accessToken.length,
        refreshTokenLength: response.refreshToken.length
      });

      // URL에서 code 파라미터 제거
      this.cleanupUrl();

      // 로그인 성공 후 원래 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl'); // 사용 후 제거

        console.log('🔄 로그인 성공! 리다이렉트 중...', { returnUrl });

        const redirectUrl = returnUrl || '/';
        console.log('📍 리다이렉트 URL:', redirectUrl);

        // 약간의 지연 후 리다이렉트 (사용자가 성공 메시지를 볼 수 있도록)
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }

      return true;
    } catch (error: any) {
      console.error('소셜 로그인 처리 오류:', error);
      setError(error.message || '로그인 중 오류가 발생했습니다.');
      return false;
    } finally {
      this.inProgress = false; // 작업 완료 후 플래그 초기화
      setLoading(false);
    }
  }

  /**
   * URL에서 제공자 감지
   */
  private static detectProviderFromUrl(): SocialProvider | null {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    
    if (state && ['google', 'kakao', 'github'].includes(state)) {
      return state as SocialProvider;
    }
    
    return null;
  }

  /**
   * Authorization code를 토큰으로 교환
   */
  private static async exchangeCodeForTokens(
    code: string, 
    provider: SocialProvider
  ): Promise<SocialLoginResponse> {
    try {
      console.log('🔄 토큰 교환 시작:', { provider, code: code });
      console.log('provider', provider);
      let response;
      
      switch (provider) {
        case 'google':
          response = await apiService.auth.googleLogin(code);
          break;
        case 'kakao':
          response = await apiService.auth.kakaoLogin(code);
          break;
        case 'github':
          response = await apiService.auth.githubLogin(code);
          break;
        default:
          throw new Error(`지원하지 않는 제공자: ${provider}`);
      }

      console.log('📥 API 응답 받음:', response);

      // 응답에서 토큰과 사용자 정보 추출
      if (response.code !== 'COMMON200' || !response.result) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }

      return response.result;
    } catch (error: any) {
      console.error('토큰 교환 오류:', error);
      throw new Error(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  /**
   * URL에서 code 파라미터 제거
   */
  private static cleanupUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    
    // 히스토리 업데이트 (새로고침 없이 URL 변경)
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * 로그아웃 처리
   */
  static async logout(): Promise<void> {
    const { logout, setLoading, setError, refreshToken } = useLoginStore.getState();
    
    try {
      setLoading(true);
      // 1) 백엔드에 로그아웃 요청을 먼저 시도 (refreshToken 전달)
      const tokenToRevoke = refreshToken ?? undefined;
      await apiService.auth.logout(tokenToRevoke);
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
      setError('로그아웃 중 오류가 발생했습니다.');
    } finally {
      // 2) 이후 로컬 스토리지/상태 정리
      logout();
      setLoading(false);
    }
  }

  /**
   * 토큰 갱신 (수동 호출용)
   */
  static async refreshAccessToken(): Promise<boolean> {
    const { refreshToken, setTokens, setError } = useLoginStore.getState();
    
    if (!refreshToken) {
      setError('리프레시 토큰이 없습니다.');
      return false;
    }

    try {
      console.log('🔄 수동 토큰 갱신 시도...');
      const response = await apiService.auth.reissueToken();
      
      if (response.success && response.result?.accessToken) {
        setTokens(response.result.accessToken, refreshToken);
        console.log('✅ 수동 토큰 갱신 성공');
        return true;
      }
      
      console.error('❌ 토큰 갱신 응답이 올바르지 않습니다:', response);
      return false;
    } catch (error: any) {
      console.error('❌ 수동 토큰 갱신 오류:', error);
      setError('토큰 갱신에 실패했습니다.');
      return false;
    }
  }
}

// 편의 함수들
export const socialLogin = {
  google: () => SocialLoginService.redirectToSocialLogin('google'),
  kakao: () => SocialLoginService.redirectToSocialLogin('kakao'),
  github: () => SocialLoginService.redirectToSocialLogin('github'),
  handleCallback: () => SocialLoginService.handleSocialLoginCallback(),
  logout: () => SocialLoginService.logout(),
  refreshToken: () => SocialLoginService.refreshAccessToken(),
};