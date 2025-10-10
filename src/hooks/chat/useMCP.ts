import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mcpApi, mcpTokenApi } from '@/services/chat/apis';
import type { 
  postMCPTokenSaveRequestBody
} from '@/types/chat/chat-type';

// MCP 상세 조회
export const useMCPDetail = (mcpId: string | null) => {
  return useQuery({
    queryKey: ['mcp-detail', mcpId],
    queryFn: () => mcpApi.getMCPDetail(mcpId!),
    select: (data) => (data as any).result || null,
    enabled: !!mcpId,
  });
};

// MCP 토큰 조회
export const useMCPToken = (mcpId: string | null) => {
  return useQuery({
    queryKey: ['mcp-token', mcpId],
    queryFn: () => mcpTokenApi.getMCPToken(mcpId!),
    select: (data) => data.result,
    enabled: !!mcpId,
  });
};

// MCP 토큰 저장
export const useSaveMCPToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ platformId, data }: { platformId: string; data: postMCPTokenSaveRequestBody }) => 
      mcpTokenApi.saveMCPToken(platformId, data),
    onSuccess: (_, { platformId }) => {
      // MCP 토큰 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ['mcp-token', platformId] });
    },
  });
};

// MCP 토큰 존재 여부 확인
export const useCheckMCPTokenExist = (platformId: string | null) => {
  return useQuery({
    queryKey: ['mcp-token-exist', platformId],
    queryFn: () => mcpTokenApi.checkMCPTokenExist(platformId!),
    select: (data) => data.result,
    enabled: !!platformId,
  });
};
