'use client';

import { useEffect } from 'react';
import { useSocialLoginCallback } from '@/hooks/auth/useSocialLoginCallback';
import { usePathname } from 'next/navigation';

/**
 * 소셜 로그인 콜백을 처리하는 컴포넌트
 * 앱 전체에서 URL의 code 파라미터를 감지하고 처리합니다.
 */
export default function SocialLoginCallbackHandler() {
  const pathname = usePathname();
  if (pathname?.includes('/auth/callback')) return null;
  const { isProcessing, error } = useSocialLoginCallback();

  // 로딩 중이거나 에러가 있을 때만 UI 표시
  if (!isProcessing && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              로그인 처리 중...
            </h2>
            <p className="text-gray-500 text-sm">
              잠시만 기다려주세요.
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              로그인 실패
            </h2>
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
