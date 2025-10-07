import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { llmApi } from '@/services/chat/apis';
import type { 
  postSettingLLMTokenRequestBody,
  patchLLMTokenRequestBody
} from '@/types/chat/chat-type';

// LLM 전체 리스트 조회
export const useLLMs = (enabled: boolean = true) => {
  console.log('🚀 useLLMs 훅이 호출되었습니다!', { enabled });
  const query = useQuery({
    queryKey: ['llms'],
    queryFn: () => {
      console.log('🌐 useLLMs queryFn 실행 - API 호출 시작');
      return llmApi.getAllLLMs();
    },
    enabled: enabled,
    select: (data) => {
      console.log('🔍 useLLMs select 함수 - 원본 데이터:', data);
      console.log('🔍 useLLMs select 함수 - data.result:', data.result);
      return data.result;
    },
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ useLLMs 성공:', query.data);
    }
    if (query.error) {
      console.error('❌ useLLMs 에러:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

// 특정 LLM 토큰 조회
export const useLLMTokens = (llmId: string | null) => {
  return useQuery({
    queryKey: ['llm-tokens', llmId],
    queryFn: () => llmApi.getLLMTokens(llmId!),
    select: (data) => data.result,
    enabled: !!llmId,
  });
};

// LLM 토큰 설정
export const useSetLLMToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: postSettingLLMTokenRequestBody) => llmApi.setLLMToken(data),
    onSuccess: (_, data) => {
      // 해당 LLM의 토큰 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ['llm-tokens', data.llmId] });
    },
  });
};

// LLM 토큰 수정
export const useUpdateLLMToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: patchLLMTokenRequestBody) => llmApi.updateLLMToken(data),
    onSuccess: (_, data) => {
      // 해당 LLM의 토큰 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ['llm-tokens', data.llmId] });
    },
  });
};
