import { generateSocialLoginUrl, extractCodeFromUrl, type SocialProvider } from '@/constants/auth/social-login';
import { apiService } from '@/services/api';
import { useLoginStore } from '@/store/login/login-store';
import type { User } from '@/store/login/login-store';

// 소셜 로그인 응답 타입
interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 소셜 로그인 서비스 클래스
export class SocialLoginService {
  /**
   * 소셜 로그인 페이지로 리다이렉트
   */
  static redirectToSocialLogin(provider: SocialProvider): void {
    const loginUrl = generateSocialLoginUrl(provider);
    window.location.href = loginUrl;
  }

  /**
   * 현재 URL에서 authorization code를 추출하고 로그인 처리
   */
  static async handleSocialLoginCallback(): Promise<boolean> {
    const { setLoading, setError, clearError } = useLoginStore.getState();
    
    try {
      setLoading(true);
      clearError();

      // URL에서 code 추출
      const code = extractCodeFromUrl(window.location.href);
      
      if (!code) {
        throw new Error('Authorization code를 찾을 수 없습니다.');
      }

      // 제공자 확인 (URL에서 추출)
      const provider = this.detectProviderFromUrl();
      if (!provider) {
        throw new Error('지원하지 않는 소셜 로그인 제공자입니다.');
      }

      // 백엔드에 code 전송하여 토큰 및 사용자 정보 받기
      const response = await this.exchangeCodeForTokens(code, provider);
      
      // 로그인 스토어에 정보 저장
      const { login } = useLoginStore.getState();
      login(response.user, response.accessToken, response.refreshToken);

      // URL에서 code 파라미터 제거
      this.cleanupUrl();

      return true;
    } catch (error: any) {
      console.error('소셜 로그인 처리 오류:', error);
      setError(error.message || '로그인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * URL에서 제공자 감지
   */
  private static detectProviderFromUrl(): SocialProvider | null {
    const url = window.location.href;
    
    if (url.includes('auth/social/google')) return 'google';
    if (url.includes('auth/social/kakao')) return 'kakao';
    if (url.includes('auth/social/github')) return 'github';
    
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

      // 응답에서 토큰과 사용자 정보 추출
      if (!response.success || !response.data) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }

      return response.data;
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
    const { logout, setLoading, setError } = useLoginStore.getState();
    
    try {
      setLoading(true);
      
      // 백엔드에 로그아웃 요청
      await apiService.auth.logout();
      
      // 로컬 스토어에서 로그인 정보 제거
      logout();
      
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
      setError('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 토큰 갱신
   */
  static async refreshAccessToken(): Promise<boolean> {
    const { refreshToken, setTokens, setError } = useLoginStore.getState();
    
    if (!refreshToken) {
      setError('리프레시 토큰이 없습니다.');
      return false;
    }

    try {
      const response = await apiService.auth.reissueToken();
      
      if (response.success && response.data) {
        setTokens(response.data.accessToken, refreshToken);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('토큰 갱신 오류:', error);
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
