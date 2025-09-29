// 간단한 연결 테스트 스크립트
// 터미널에서 실행: node test-connection.js

const axios = require('axios');

async function testConnection() {
  console.log('🔧 AxiosInstance 연결 테스트 시작...\n');

  // 1. 환경변수 확인
  console.log('1️⃣ 환경변수 확인:');
  console.log('   NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || '❌ 설정되지 않음');
  console.log('   NODE_ENV:', process.env.NODE_ENV || '❌ 설정되지 않음');
  console.log('');

  // 2. AxiosInstance 기본 설정 확인
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  console.log('2️⃣ AxiosInstance 설정:');
  console.log('   Base URL:', axiosInstance.defaults.baseURL);
  console.log('   Timeout:', axiosInstance.defaults.timeout + 'ms');
  console.log('   Headers:', JSON.stringify(axiosInstance.defaults.headers, null, 2));
  console.log('');

  // 3. 연결 테스트
  console.log('3️⃣ 서버 연결 테스트:');
  try {
    // 존재하지 않는 엔드포인트로 테스트 (404가 나와도 정상)
    const response = await axiosInstance.get('/test-connection');
    console.log('   ✅ 연결 성공!');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ 서버에 연결할 수 없습니다.');
      console.log('   💡 백엔드 서버가 실행 중인지 확인하세요.');
    } else if (error.response?.status === 404) {
      console.log('   ✅ 서버 연결 성공! (404는 정상 - 테스트 엔드포인트가 없음)');
      console.log('   Status:', error.response.status);
    } else {
      console.log('   ⚠️ 예상치 못한 에러:', error.message);
    }
  }
  console.log('');

  // 4. 요청 인터셉터 테스트
  console.log('4️⃣ 요청 인터셉터 테스트:');
  axiosInstance.interceptors.request.use((config) => {
    console.log('   📤 요청 전송:', config.method?.toUpperCase(), config.url);
    console.log('   📋 요청 헤더:', JSON.stringify(config.headers, null, 2));
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('   📥 응답 수신:', response.status, response.statusText);
      return response;
    },
    (error) => {
      console.log('   ❌ 응답 에러:', error.response?.status || error.message);
      return Promise.reject(error);
    }
  );

  try {
    await axiosInstance.get('/test-interceptor');
  } catch (error) {
    // 에러는 예상된 것
  }

  console.log('\n🎉 테스트 완료!');
  console.log('💡 브라우저에서 http://localhost:3000/test-env 와 http://localhost:3000/test-api 를 확인해보세요.');
}

// 환경변수 로드 (dotenv 사용)
require('dotenv').config({ path: '.env.local' });

testConnection().catch(console.error);
