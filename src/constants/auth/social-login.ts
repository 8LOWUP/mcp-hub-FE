// 소셜 로그인 관련 상수

// 소셜 로그인 제공자 타입
export type SocialProvider = 'google' | 'kakao' | 'github';

// 소셜 로그인 URL 상수
export const SOCIAL_LOGIN_URLS = {
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  kakao: 'https://kauth.kakao.com/oauth/authorize',
  github: 'https://github.com/login/oauth/authorize',
} as const;

// 소셜 로그인 클라이언트 ID
export const SOCIAL_CLIENT_IDS = {
  google: '832063941487-n0jfql1063c6d05u53u4076n09c2kpqb.apps.googleusercontent.com',
  kakao: '28d0cd3dbac0f2ebb39cc230d4ac0c92',
  github: '', // 깃허브 클라이언트 ID는 환경변수에서 가져올 예정
} as const;

// 리다이렉트 URI
export const REDIRECT_URIS = {
  google: 'http://localhost:3000/auth-callback.html',
  kakao: 'http://localhost:3000/auth-callback.html',
  github: 'http://localhost:3000/auth-callback.html',
} as const;

// 소셜 로그인 파라미터 생성 함수
export const generateSocialLoginUrl = (provider: SocialProvider): string => {
  const baseUrl = SOCIAL_LOGIN_URLS[provider];
  const clientId = SOCIAL_CLIENT_IDS[provider];
  const redirectUri = REDIRECT_URIS[provider];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: provider, // 제공자 정보를 state 파라미터에 포함
  });

  // 제공자별 추가 파라미터
  switch (provider) {
    case 'google':
      params.append('scope', 'profile email');
      break;
    case 'kakao':
      // 카카오는 기본 파라미터만 사용
      break;
    case 'github':
      params.append('scope', 'user:email');
      break;
  }

  return `${baseUrl}?${params.toString()}`;
};

// URL에서 authorization code 추출 함수
export const extractCodeFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('code');
  } catch (error) {
    console.error('URL 파싱 오류:', error);
    return null;
  }
};

// 소셜 로그인 에러 메시지
export const SOCIAL_LOGIN_ERRORS = {
  ACCESS_DENIED: '사용자가 로그인을 취소했습니다.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  UNAUTHORIZED_CLIENT: '인증되지 않은 클라이언트입니다.',
  UNSUPPORTED_RESPONSE_TYPE: '지원하지 않는 응답 타입입니다.',
  INVALID_SCOPE: '잘못된 스코프입니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  TEMPORARILY_UNAVAILABLE: '일시적으로 서비스를 이용할 수 없습니다.',
} as const;
