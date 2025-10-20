// src/lib/imageLoader.js
function imageLoader({ src }) {
  // @https://img.com 또는 https://img.com으로 시작하는 URL인 경우 API URL로 변환
  if (src.startsWith('@https://img.com') || src.startsWith('https://img.com')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mcphubcorp.site';
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');

    // @https://img.com/ocr.png -> https://mcphubcorp.site/img.com/ocr.png
    // https://img.com/payment.png -> https://mcphubcorp.site/img.com/payment.png
    const cleanSrc = src.replace('@', ''); // @ 제거
    const result = cleanSrc.replace('https://img.com', `${cleanApiUrl}/img.com`);
    return result;
  }
  
  // /mcps로 시작하는 경우 API URL을 붙임
  if (src.startsWith('/mcps')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mcphubcorp.site';
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');
    const result = `${cleanApiUrl}${src}`;
    return result;
  }
  
  // 다른 URL은 그대로 반환
  return src;
}

module.exports = imageLoader;
