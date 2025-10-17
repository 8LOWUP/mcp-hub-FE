"use client";

import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSocialLoginCallback } from "@/hooks/auth/useSocialLoginCallback";
import { stripLocale, withLocale, AFTER_LOGIN_DEFAULT_BASE_PATH } from "@/constants/routes";

export default function SocialLoginCallbackHandler() {
  // ✅ 모든 훅은 항상 호출
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { isProcessing, error } = useSocialLoginCallback();

  // 이후부터는 렌더링 분기만
  const code = sp.get("code");

  // 전용 콜백 라우트는 전역 핸들러 비활성화
  if (pathname) {
    const { basePath } = stripLocale(pathname);
    if (basePath.startsWith("/auth/callback")) {
      return null;
    }
  }

  // code 없으면 표시 안 함
  if (!code) return null;

  const handleGoHome = () => {
    const { locale } = stripLocale(pathname || "/");
    const fallback = withLocale(AFTER_LOGIN_DEFAULT_BASE_PATH, locale); // e.g. "/ko/market"
    router.replace(fallback);
  };

  if (!isProcessing && !error) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
          {isProcessing ? (
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">로그인 처리 중...</h2>
                <p className="text-gray-500 text-sm">잠시만 기다려주세요.</p>
              </div>
          ) : (
              error && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">로그인 실패</h2>
                    <p className="text-red-600 text-sm mb-5 break-words">{error}</p>
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full"
                    >
                      홈으로 돌아가기
                    </button>
                  </div>
              )
          )}
        </div>
      </div>
  );
}
