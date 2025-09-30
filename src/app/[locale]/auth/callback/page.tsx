'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socialLogin } from '@/services/auth/social-login';
import { useLoginStore } from '@/store/login/login-store';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('로그인 처리 중...');
  const searchParams = useSearchParams();
  const { isLoading, error } = useLoginStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 콜백 페이지에서 로그인 처리 시작:', {
          url: window.location.href,
          searchParams: window.location.search,
          pathname: window.location.pathname,
          timestamp: new Date().toISOString()
        });

        const success = await socialLogin.handleCallback();

        console.log('📊 로그인 처리 결과:', {
          success,
          status: success ? 'success' : 'error',
          timestamp: new Date().toISOString()
        });

        if (success) {
          setStatus('success');
          setMessage('로그인 성공! 잠시 후 이동합니다...');
        } else {
          setStatus('error');
          setMessage('로그인에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('❌ 콜백 처리 오류:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        setStatus('error');
        setMessage(error.message || '로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-xl font-semibold text-gray-700 mb-2">
                {message}
              </h1>
              <p className="text-gray-500 text-sm">
                카카오에서 받은 정보를 처리하고 있습니다.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-700 mb-2">
                로그인 성공!
              </h1>
              <p className="text-gray-500 text-sm">
                잠시 후 자동으로 이동합니다.
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-700 mb-2">
                로그인 실패
              </h1>
              <p className="text-red-600 text-sm mb-4">
                {message}
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
