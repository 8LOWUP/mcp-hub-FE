'use client';

import { GoogleLoginButton, KakaoLoginButton, GithubLoginButton } from '@/components/auth/SocialLoginButton';
import { useLoginStore } from '@/store/login/login-store';
import { socialLogin } from '@/services/auth/social-login';
import { generateSocialLoginUrl } from '@/constants/auth/social-login';

export default function TestLoginPage() {
  const { isLoggedIn, user, isLoading, error, logout } = useLoginStore();

  const handleLogout = async () => {
    await socialLogin.logout();
  };

  const handleRefreshToken = async () => {
    const success = await socialLogin.refreshToken();
    console.log('토큰 갱신 결과:', success);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 소셜 로그인 테스트 페이지
        </h1>
        
        {/* 로그인 상태 표시 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 로그인 상태</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">로그인 상태</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isLoggedIn ? '로그인됨' : '로그아웃됨'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">로딩 상태</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isLoading ? '로딩 중' : '대기 중'}
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <span className="font-medium text-red-800">에러:</span>
                <span className="text-red-700 ml-2">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* 사용자 정보 표시 */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">👤 사용자 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">ID</span>
                <span className="font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">이름</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">이메일</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">제공자</span>
                <span className="capitalize">{user.provider}</span>
              </div>
              {user.profileImage && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">프로필 이미지</span>
                  <img 
                    src={user.profileImage} 
                    alt="프로필" 
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 소셜 로그인 버튼들 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 소셜 로그인</h2>
          <div className="space-y-3">
            <GoogleLoginButton className="w-full" />
            <KakaoLoginButton className="w-full" />
            <GithubLoginButton className="w-full" />
          </div>
        </div>

        {/* 생성된 URL 확인 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔗 생성된 소셜 로그인 URL</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-medium text-sm mb-1">Google:</div>
              <div className="text-xs font-mono break-all text-blue-600">
                {generateSocialLoginUrl('google')}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-medium text-sm mb-1">Kakao:</div>
              <div className="text-xs font-mono break-all text-yellow-600">
                {generateSocialLoginUrl('kakao')}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-medium text-sm mb-1">GitHub:</div>
              <div className="text-xs font-mono break-all text-gray-600">
                {generateSocialLoginUrl('github')}
              </div>
            </div>
          </div>
        </div>

        {/* 로그인된 상태에서만 표시되는 액션들 */}
        {isLoggedIn && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ 액션</h2>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
              <button
                onClick={handleRefreshToken}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                토큰 갱신 테스트
              </button>
            </div>
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 사용법</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• <strong>헤더의 "Log In" 버튼</strong>을 클릭하면 로그인 모달이 열립니다</li>
            <li>• 소셜 로그인 버튼을 클릭하면 해당 제공자의 로그인 페이지로 이동합니다</li>
            <li>• 로그인 성공 시 자동으로 돌아와서 사용자 정보가 표시됩니다</li>
            <li>• 헤더에 사용자 이름과 프로필 이미지가 표시됩니다</li>
            <li>• 토큰은 자동으로 localStorage와 Zustand 스토어에 저장됩니다</li>
            <li>• API 요청 시 Authorization 헤더가 자동으로 추가됩니다</li>
            <li>• 401 에러 시 자동으로 로그아웃 처리됩니다</li>
          </ul>
        </div>

        {/* 헤더 연동 안내 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-green-900 mb-2">🎯 헤더 연동 완료!</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• 기존 헤더의 "Log In" 버튼이 우리 소셜 로그인과 연동되었습니다</li>
            <li>• 로그인 후 헤더에 사용자 이름과 프로필 이미지가 표시됩니다</li>
            <li>• 헤더의 "Logout" 버튼으로 로그아웃할 수 있습니다</li>
            <li>• 랜딩 페이지에서만 로그인 모달이 열리고, 다른 페이지에서는 profiles로 이동합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
