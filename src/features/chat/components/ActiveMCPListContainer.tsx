// chat/components/ActiveMCPListContainer.tsx
"use client";

import { useMemo, memo } from "react";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useWorkspaceDetail } from "@/hooks/chat/useWorkspaces";
import { useLocalMCPState } from "@/hooks/chat/useLocalMCPState";
import { useLoginStore } from "@/store/login/login-store";
import ActiveMCPCard from "./ActiveMCPCard";

const ActiveMCPListContainer = memo(function ActiveMCPListContainer() {
  const { currentWorkspaceId } = useCurrentWorkspace();
  const { data: workspaceDetail, isLoading } = useWorkspaceDetail(
    currentWorkspaceId && !currentWorkspaceId.startsWith('new-') ? currentWorkspaceId : null
  );

  // serverMcps를 메모이제이션하여 무한 루프 방지
  const serverMcps = useMemo(() => workspaceDetail?.mcps ?? [], [workspaceDetail?.mcps]);
  
  // 로컬 MCP 상태 관리 (debounce + 강제 동기화)
  const { localMcps, toggleMcp, isSyncing } = useLocalMCPState(
    currentWorkspaceId,
    serverMcps
  );


  const toggleMcpActive = (mcpId: string, next: boolean) => {
    if (!currentWorkspaceId || currentWorkspaceId.startsWith('new-')) return;
    
    // 인증 상태 확인
    const { isLoggedIn, accessToken } = useLoginStore.getState();
    if (!isLoggedIn || !accessToken) {
      console.error('❌ 로그인되지 않았거나 토큰이 없습니다.');
      alert('로그인이 필요합니다.');
      return;
    }
    
    console.log('🔄 MCP 상태 변경 (로컬 + debounce):', { mcpId, next, workspaceId: currentWorkspaceId });
    toggleMcp(mcpId, next);
  };

  return (
    <>
      <h2 className="text-2xl font-bold p-3">Active MCP</h2>
      <ul className="flex flex-col w-full rounded-2xl h-fit overflow-y-auto bg-surface-2 p-2">
        {isLoading ? (
          <li className="text-sm text-foreground/60 p-3">MCP 정보를 불러오는 중...</li>
        ) : localMcps.length === 0 ? (
          <li className="text-sm text-foreground/60 p-3">활성화된 MCP가 없습니다</li>
        ) : (
          localMcps.map((mcp) => (
            <li key={mcp.id} className="mb-2 last:mb-0">
            <ActiveMCPCard
              id={mcp.id}
              name={`MCP-${mcp.id}`}
              active={mcp.active}
              onToggle={(next) => toggleMcpActive(mcp.id, next)}
              isLoading={isSyncing}
            />
            </li>
          ))
        )}
      </ul>
    </>
  );
});

export default ActiveMCPListContainer;