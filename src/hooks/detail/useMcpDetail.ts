import { useQuery } from '@tanstack/react-query';
import { getMcpDetail } from '@/services/detail/mpc-api';

/**
 * MCP 상세 정보를 가져오는 훅
 */
export const useMcpDetail = (mcpId: string | number | null) => {
  return useQuery({
    queryKey: ['mcp-detail', mcpId],
    queryFn: () => getMcpDetail(Number(mcpId)),
    enabled: !!mcpId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2,
  });
};

/**
 * 여러 MCP의 상세 정보를 병렬로 가져오는 훅
 */
export const useMcpDetails = (mcpIds: (string | number)[]) => {
  return useQuery({
    queryKey: ['mcp-details', mcpIds.sort().join(',')],
    queryFn: async () => {
      const promises = mcpIds.map(id => getMcpDetail(Number(id)));
      return Promise.all(promises);
    },
    enabled: mcpIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2,
  });
};
