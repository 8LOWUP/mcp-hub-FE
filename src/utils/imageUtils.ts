/**
 * 이미지 URL을 처리하는 유틸리티 함수들
 */

/**
 * MCP 이미지 URL을 올바른 API URL로 변환
 * @param rawImageUrl - 원본 이미지 URL
 * @returns 처리된 이미지 URL 또는 null
 */
export const processMcpImageUrl = (rawImageUrl?: string | null): string | null => {
  if (!rawImageUrl) return null;

  // /mcps로 시작하는 경우 API URL을 붙임
  if (rawImageUrl.startsWith('/mcps')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');
    return `${cleanApiUrl}${rawImageUrl}`;
  }

  // https://img.com으로 시작하는 경우 API URL로 변환
  if (rawImageUrl.startsWith('https://img.com')) {
    return rawImageUrl.replace('https://img.com', process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080');
  }

  // 다른 URL은 그대로 반환
  return rawImageUrl;
};

/**
 * 이미지 로드 실패 시 표시할 대체 아이콘 컴포넌트의 props
 * @param displayName - 표시할 이름
 * @param size - 아이콘 크기 ('sm' | 'md' | 'lg')
 * @returns 대체 아이콘의 className과 텍스트
 */
export const getFallbackIconProps = (displayName: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return {
    className: `${sizeClasses[size]} rounded-md flex items-center justify-center bg-surface-1 text-xs text-secondary font-bold flex-shrink-0`,
    text: displayName.charAt(0).toUpperCase()
  };
};
