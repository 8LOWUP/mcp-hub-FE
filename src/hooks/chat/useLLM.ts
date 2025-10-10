import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { llmApi } from '@/services/chat/apis';
import type { 
  postSettingLLMTokenRequestBody,
  patchLLMTokenRequestBody
} from '@/types/chat/chat-type';

// LLM 전체 리스트 조회
export const useLLMs = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ['llms'],
    queryFn: () => llmApi.getAllLLMs(),
    enabled: enabled,
    select: (data) => data.llmList,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    cacheTime: 10 * 60 * 1000, // 10분간 메모리에 보관
  });


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
