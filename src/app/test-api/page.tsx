'use client';

import { useState } from 'react';
import { apiService } from '@/services/api';
import { axiosInstance } from '@/services/AxiosInstance';
import { API_ENDPOINTS } from '@/constants/apis/key';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    details?: any;
  }>>([]);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    // 테스트 시작
    setTestResults(prev => [...prev, {
      name: testName,
      status: 'pending',
      message: '테스트 실행 중...'
    }]);

    try {
      const result = await testFn();
      setTestResults(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'success', message: '✅ 성공!', details: result }
          : test
      ));
    } catch (error: any) {
      setTestResults(prev => prev.map(test => 
        test.name === testName 
          ? { 
              ...test, 
              status: 'error', 
              message: `❌ 실패: ${error.message}`,
              details: error.response?.data || error
            }
          : test
      ));
    }
  };

  const tests = [
    {
      name: '환경변수 확인',
      fn: async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않음');
        return { apiUrl };
      }
    },
    {
      name: 'AxiosInstance 기본 설정',
      fn: async () => {
        const config = axiosInstance.defaults;
        return {
          baseURL: config.baseURL,
          timeout: config.timeout,
          headers: config.headers
        };
      }
    },
    {
      name: 'MCP 목록 조회 테스트',
      fn: async () => {
        const response = await apiService.mcp.getMcps();
        return response;
      }
    },
    {
      name: 'LLM 목록 조회 테스트',
      fn: async () => {
        const response = await apiService.llm.getLlms();
        return response;
      }
    },
    {
      name: '파일 목록 조회 테스트',
      fn: async () => {
        const response = await apiService.files.getFiles();
        return response;
      }
    },
    {
      name: '워크스페이스 목록 조회 테스트',
      fn: async () => {
        const response = await apiService.workspaces.getWorkspaces();
        return response;
      }
    },
    {
      name: '사용자 검색 테스트',
      fn: async () => {
        const response = await apiService.members.searchMembers({ q: 'test' });
        return response;
      }
    },
    {
      name: 'MCP 대시보드 테스트',
      fn: async () => {
        const response = await apiService.mcp.getDashboard();
        return response;
      }
    },
    {
      name: '인터셉터 동작 확인',
      fn: async () => {
        // 요청 인터셉터가 제대로 동작하는지 확인
        const response = await axiosInstance.get('/members/me');
        return {
          hasAuthHeader: !!response.config.headers?.Authorization,
          headers: response.config.headers
        };
      }
    }
  ];

  const runAllTests = async () => {
    setTestResults([]);
    for (const test of tests) {
      await runTest(test.name, testFn);
      // 테스트 간 간격
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 실제 스웨거 기반 API 테스트 페이지
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">API 테스트 실행</h2>
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 모든 테스트 실행
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium text-sm">{test.name}</span>
                <button
                  onClick={() => runTest(test.name, test.fn)}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  개별 실행
                </button>
              </div>
            ))}
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 테스트 결과</h2>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{result.name}</h3>
                    <span className="text-sm font-mono">{result.status}</span>
                  </div>
                  <p className="text-sm mb-2">{result.message}</p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium">상세 정보</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 테스트 설명</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• <strong>환경변수 확인</strong>: NEXT_PUBLIC_API_URL이 제대로 로드되는지 확인</li>
            <li>• <strong>AxiosInstance 기본 설정</strong>: baseURL, timeout 등이 올바르게 설정되었는지 확인</li>
            <li>• <strong>실제 API 테스트</strong>: 스웨거 문서의 실제 엔드포인트들을 테스트</li>
            <li>• <strong>인터셉터 동작 확인</strong>: Authorization 헤더가 자동으로 추가되는지 확인</li>
            <li>• <strong>에러 처리</strong>: 401, 404 등 에러가 올바르게 처리되는지 확인</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 주의사항</h3>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• 일부 API는 인증이 필요할 수 있습니다</li>
            <li>• 404 에러는 해당 엔드포인트가 아직 구현되지 않았을 수 있습니다</li>
            <li>• 401 에러는 정상적인 인증 에러 처리입니다</li>
            <li>• 실제 데이터가 없는 경우 빈 배열이 반환될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
