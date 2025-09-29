'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socialLogin } from '@/services/auth/social-login';
import { useLoginStore } from '@/store/login/login-store';

export const useSocialLoginCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isLoading, error: storeError } = useLoginStore();

  useEffect(() => {
    const handleCallback = async () => {
      // URL에 code 파라미터가 있는지 확인
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) return;

      setIsProcessing(true);
      setError(null);

      try {
        const success = await socialLogin.handleCallback();
        
        if (success) {
          // 로그인 성공 시 메인 페이지로 리다이렉트
          router.push('/');
        } else {
          setError('로그인에 실패했습니다.');
        }
      } catch (err: any) {
        console.error('로그인 콜백 처리 오류:', err);
        setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router]);

  return {
    isProcessing: isProcessing || isLoading,
    error: error || storeError,
  };
};
