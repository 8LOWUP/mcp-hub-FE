// chat/components/ActiveMCPListContainer.tsx
"use client";

import { useMemo, memo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useWorkspaceDetail } from "@/hooks/chat/useWorkspaces";
import { useLocalMCPState } from "@/hooks/chat/useLocalMCPState";
import { useLoginStore } from "@/store/login/login-store";
import { fetchMyMcps } from "@/features/profiles/apis/mcps";
import ActiveMCPCard from "./ActiveMCPCard";
import NewWorkspaceMCPCard from "./NewWorkspaceMCPCard";
import MCPCardSkeleton from "./MCPCardSkeleton";
import { useMcpSelectionStore } from "@/store/chat/mcp-selection-store";

const ActiveMCPListContainer = memo(function ActiveMCPListContainer() {
  const { currentWorkspaceId } = useCurrentWorkspace();
  const isWorkspaceSelected = !!(currentWorkspaceId && !currentWorkspaceId.startsWith('new-'));

  const { data: workspaceDetail, isLoading: isWorkspaceLoading } = useWorkspaceDetail(
    isWorkspaceSelected ? currentWorkspaceId : null
  );

  // 워크스페이스가 선택되지 않은 경우: 저장된 MCP 리스트 불러오기 (내 MCP)
  const { data: mySavedMcps, isLoading: isMyMcpsLoading } = useQuery({
    queryKey: ["my-mcps"],
    queryFn: async () => {
      const page = await fetchMyMcps({ page: 0, size: 100 });
      return page.content;
    },
    enabled: !isWorkspaceSelected,
  });

  // serverMcps를 메모이제이션하여 무한 루프 방지
  const serverMcps = useMemo(() => {
    if (isWorkspaceSelected) {
      // (롤백) 상세 응답의 mcps 사용
      return workspaceDetail?.mcps ?? [];
    }
    // 워크스페이스 미선택 시: 저장된 MCP들을 활성(true)로 매핑해 표기
    const saved = mySavedMcps ?? [];
    return saved.map((m) => ({ id: String(m.id), active: true }));
  }, [isWorkspaceSelected, workspaceDetail?.mcps, mySavedMcps]);

  // 선택된 워크스페이스의 MCP 목록 콘솔 출력
  if (isWorkspaceSelected && workspaceDetail) {
    console.log("[ActiveMCP] Workspace detail loaded:", workspaceDetail);
    console.log("[ActiveMCP] Workspace mcps:", serverMcps);
  }
  
  // 로컬 MCP 상태 관리 (debounce + 강제 동기화)
  const { localMcps, toggleMcp, isSyncing } = useLocalMCPState(
    currentWorkspaceId,
    serverMcps
  );

  // 새 워크스페이스 모드일 때 전역 선택 스토어와 동기화
  const setAllMcps = useMcpSelectionStore((s) => s.setAll);
  const selectionToggle = useMcpSelectionStore((s) => s.toggle);
  useEffect(() => {
    if (!isWorkspaceSelected) {
      setAllMcps(localMcps);
    }
  }, [isWorkspaceSelected, localMcps, setAllMcps]);


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
      <h2 className="text-2xl font-bold pb-4">Active MCP</h2>
      <ul className="flex flex-col w-full rounded-md h-fit overflow-y-auto bg-surface-2 p-2">
        {isWorkspaceSelected ? (
          isWorkspaceLoading ? (
            // 워크스페이스 로딩 중 - 3개의 스켈레톤 표시
            Array.from({ length: 1 }).map((_, index) => (
              <li key={`skeleton-active-${index}`} className="mb-2 last:mb-0">
                <MCPCardSkeleton variant="active" />
              </li>
            ))
          ) : localMcps.length === 0 ? (
            <li className="text-sm text-foreground/60 p-3">MCP가 할당되지 않았습니다.</li>
          ) : (
            localMcps
              .filter((mcp) => typeof mcp.id === 'string' && mcp.id)
              .map((mcp) => {
                const id = String(mcp.id);
                return (
              <li key={mcp.id} className="mb-2 last:mb-0">
                <ActiveMCPCard
                  id={id}
                  active={mcp.active}
                  onToggle={(next) => toggleMcpActive(id, next)}
                  detailText={`WS: ${workspaceDetail?.title ?? ''} (${workspaceDetail?.workspaceId ?? ''})`}
                  isLoading={isSyncing}
                />
              </li>
                );
              })
          )
        ) : isMyMcpsLoading ? (
          // 내 MCP 로딩 중 - 3개의 스켈레톤 표시
          Array.from({ length: 3 }).map((_, index) => (
            <li key={`skeleton-new-${index}`} className="mb-2 last:mb-0">
              <MCPCardSkeleton variant="new-workspace" />
            </li>
          ))
        ) : localMcps.length === 0 ? (
          <li className="text-sm text-foreground/60 p-3">활성화된 MCP가 없습니다</li>
        ) : (
          localMcps
            .filter((mcp) => typeof mcp.id === 'string' && mcp.id)
            .map((mcp) => {
              const id = String(mcp.id);
              return (
            <li key={id} className="mb-2 last:mb-0">
              <NewWorkspaceMCPCard
                id={id}
                selected={mcp.active}
                isLoading={isSyncing}
                onSelect={(next) => {
                  toggleMcp(id, next);
                  selectionToggle(id, next);
                }}
              />
            </li>
              );
            })
        )}
      </ul>
    </>
  );
});

export default ActiveMCPListContainer;