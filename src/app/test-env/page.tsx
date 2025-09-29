'use client';

import { useEffect, useState } from 'react';

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // 환경변수 확인
    const vars = {
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL || '❌ 설정되지 않음',
      'NODE_ENV': process.env.NODE_ENV || '❌ 설정되지 않음',
      'NEXT_PUBLIC_DEBUG': process.env.NEXT_PUBLIC_DEBUG || '❌ 설정되지 않음',
    };
    
    setEnvVars(vars);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔧 환경변수 테스트 페이지
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 환경변수 상태</h2>
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm text-gray-700">{key}</span>
                <span className={`font-mono text-sm px-2 py-1 rounded ${
                  value.includes('❌') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 확인 방법</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• NEXT_PUBLIC_API_URL이 올바르게 설정되었는지 확인</li>
            <li>• NODE_ENV가 development인지 확인</li>
            <li>• NEXT_PUBLIC_DEBUG가 true인지 확인</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
