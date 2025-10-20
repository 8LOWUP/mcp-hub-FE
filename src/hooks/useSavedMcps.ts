"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyMcps } from "@/features/profiles/apis/mcps";
import { useLoginStore } from "@/store/login/login-store";

/**
 * 사용자가 저장한 MCP 목록을 가져오는 훅
 * 로그인하지 않은 경우 API 호출하지 않음
 */
export const useSavedMcps = () => {
  const { isLoggedIn } = useLoginStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["saved-mcps"],
    queryFn: async () => {
      const response = await fetchMyMcps({ page: 0, size: 1000 }); // 충분히 큰 사이즈로 모든 저장된 MCP 가져오기
      return response.content;
    },
    enabled: isLoggedIn, // 로그인한 경우에만 API 호출
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  });

  // 저장된 MCP ID 목록만 추출 (로그인하지 않은 경우 빈 배열)
  const savedMcpIds = isLoggedIn ? (data?.map(mcp => mcp.id.toString()) ?? []) : [];

  return {
    savedMcps: data ?? [],
    savedMcpIds,
    isLoading: isLoggedIn ? isLoading : false,
    error,
    isLoggedIn,
  };
};
