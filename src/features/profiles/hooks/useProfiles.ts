// src/features/profiles/hooks/useProfiles.ts
import { useMemo } from "react";
import { DUMMY_MCP_LIST } from "@/features/profiles/components/card";

// 실제 API 연결 전 임시 훅. 나중에 tanstack-query로 교체.
export const useProfiles = () => {
    // 여기선 가벼운 가공만. (예: 정렬/필터)
    const mcpList = useMemo(() => DUMMY_MCP_LIST, []);
    return { mcpList };
};
