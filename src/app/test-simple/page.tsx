'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/services/AxiosInstance';

export default function TestSimplePage() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // 1. 환경변수 확인
    addResult('🔧 환경변수 확인 중...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      addResult(`✅ NEXT_PUBLIC_API_URL: ${apiUrl}`);
    } else {
      addResult('❌ NEXT_PUBLIC_API_URL이 설정되지 않음');
      addResult('💡 .env.local 파일을 확인하세요');
    }

    // 2. AxiosInstance 설정 확인
    addResult('🔧 AxiosInstance 설정 확인 중...');
    try {
      addResult(`✅ Base URL: ${axiosInstance.defaults.baseURL}`);
      addResult(`✅ Timeout: ${axiosInstance.defaults.timeout}ms`);
      addResult(`✅ Headers: ${JSON.stringify(axiosInstance.defaults.headers)}`);
    } catch (error) {
      addResult(`❌ AxiosInstance 설정 오류: ${error}`);
    }

    // 3. 간단한 연결 테스트
    addResult('🔧 서버 연결 테스트 중...');
    axiosInstance.get('/test')
      .then(response => {
        addResult(`✅ 연결 성공! Status: ${response.status}`);
      })
      .catch(error => {
        if (error.code === 'ECONNREFUSED') {
          addResult('❌ 서버에 연결할 수 없음 (백엔드 서버가 실행되지 않음)');
        } else if (error.response?.status === 404) {
          addResult('✅ 서버 연결 성공! (404는 정상 - 테스트 엔드포인트가 없음)');
        } else {
          addResult(`⚠️ 예상치 못한 에러: ${error.message}`);
        }
      });

  }, []);

  const clearResults = () => {
    setResults([]);
  };

  const runManualTest = async () => {
    addResult('🔧 수동 테스트 시작...');
    try {
      const response = await axiosInstance.get('/manual-test');
      addResult(`✅ 수동 테스트 성공: ${response.status}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        addResult('✅ 수동 테스트 성공! (404는 정상)');
      } else {
        addResult(`❌ 수동 테스트 실패: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 간단한 연결 테스트
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">테스트 결과</h2>
            <div className="space-x-2">
              <button
                onClick={runManualTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 수동 테스트
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🗑️ 결과 지우기
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">테스트 결과가 여기에 표시됩니다...</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 브라우저 콘솔에서도 확인 가능</h3>
          <p className="text-blue-800 text-sm mb-2">
            개발자 도구(F12)를 열고 콘솔에서 다음 명령어를 실행해보세요:
          </p>
          <div className="bg-gray-100 p-2 rounded font-mono text-sm">
            <div>// 환경변수 확인</div>
            <div>console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);</div>
            <div className="mt-2">// AxiosInstance 확인</div>
            <div>import axiosInstance from '@/services/AxiosInstance';</div>
            <div>console.log('Axios Config:', axiosInstance.defaults);</div>
          </div>
        </div>
      </div>
    </div>
  );
}
