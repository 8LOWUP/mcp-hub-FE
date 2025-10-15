// src/lib/imageLoader.js
export default function imageLoader({ src }) {
  // @https://img.com 또는 https://img.com으로 시작하는 URL인 경우 API URL로 변환
  if (src.startsWith('@https://img.com') || src.startsWith('https://img.com')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');
    
    // @https://img.com/ocr.png -> https://localhost:8080/img.com/ocr.png
    // https://img.com/payment.png -> https://localhost:8080/img.com/payment.png
    const cleanSrc = src.replace('@', ''); // @ 제거
    return cleanSrc.replace('https://', `${cleanApiUrl}/`);
  }
  
  // /mcp로 시작하는 경우 API URL을 붙임
  if (src.startsWith('/mcp')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');
    return `${cleanApiUrl}${src}`;
  }
  
  // 다른 URL은 그대로 반환
  return src;
}
