import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { useUpdateWorkspaceMcps } from './useWorkspaces';
import { mcpInfo } from '@/types/chat/chat-type';

/**
 * MCP 상태를 로컬에서 관리하고 debounce로 서버에 동기화하는 훅
 */
export const useLocalMCPState = (workspaceId: string | null, initialMcps: mcpInfo[] = []) => {
  // initialMcps를 메모이제이션하여 무한 루프 방지
  const memoizedInitialMcps = useMemo(() => initialMcps, [
    initialMcps.length,
    initialMcps.map(mcp => `${mcp.id}-${mcp.active}`).join(',')
  ]);

  const [localMcps, setLocalMcps] = useState<mcpInfo[]>(memoizedInitialMcps);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const updateMcpsMutation = useUpdateWorkspaceMcps();

  // 초기 MCP 상태 동기화 (메모이제이션된 값 사용)
  useEffect(() => {
    setLocalMcps(memoizedInitialMcps);
    setHasUnsavedChanges(false);
    console.log('🟢 [useLocalMCPState] 초기 로드된 MCP 리스트:', memoizedInitialMcps);
  }, [memoizedInitialMcps]);

  // 800ms debounce로 서버 동기화
  const debouncedSyncToServer = useCallback(
    useDebouncedCallback(
      async (mcps: mcpInfo[]) => {
        if (!workspaceId || workspaceId.startsWith('new-')) return;
        
        try {
          await updateMcpsMutation.mutateAsync({
            workspaceId,
            data: { mcps }
          });
          setHasUnsavedChanges(false);
          console.log('✅ [useLocalMCPState] 서버 동기화 완료. 최종 MCP 리스트:', mcps);
        } catch (error) {
          console.error('MCP 상태 동기화 실패:', error);
          // 실패 시 이전 상태로 롤백
          setLocalMcps(memoizedInitialMcps);
        }
      },
      800
    ),
    [workspaceId, updateMcpsMutation, memoizedInitialMcps]
  );

  // MCP 상태 토글
  const toggleMcp = useCallback((mcpId: string, active: boolean) => {
    console.log(`🔄 MCP 토글: ${mcpId} → ${active ? '활성화' : '비활성화'} (로컬 상태 즉시 변경)`);
    
    setLocalMcps(prev => {
      console.log('📥 [useLocalMCPState] 이전 MCP 리스트(prev):', prev);
      const updated = prev.map(mcp =>
        mcp.id === mcpId ? { ...mcp, active } : mcp
      );
      console.log('📤 [useLocalMCPState] 업데이트된 MCP 리스트(updated):', updated);
      
      setHasUnsavedChanges(true);
      console.log('⏰ 800ms debounce 타이머 시작...');
      debouncedSyncToServer(updated);

      // 새 워크스페이스(또는 미선택) 모드에서는 전체 MCP 리스트를 함께 로깅
      if (!workspaceId || workspaceId.startsWith('new-')) {
        console.log('📝 New Workspace MCP 리스트 업데이트:', updated);
      }
      // setState 직후 스냅샷 확인용 (렌더 이후 큐)
      setTimeout(() => {
        try {
          console.log('📦 [useLocalMCPState] setState 이후(localMcps 최신 스냅샷 가정):', updated);
        } catch {}
      }, 0);
      
      return updated;
    });
  }, [debouncedSyncToServer, workspaceId]);

  // 강제 동기화 (채팅 전송 시 사용)
  const forceSync = useCallback(async () => {
    if (!workspaceId || workspaceId.startsWith('new-') || !hasUnsavedChanges) return;
    
    try {
      await updateMcpsMutation.mutateAsync({
        workspaceId,
        data: { mcps: localMcps }
      });
      setHasUnsavedChanges(false);
      console.log('✅ [useLocalMCPState] 강제 동기화 완료. 최종 MCP 리스트:', localMcps);
    } catch (error) {
      console.error('MCP 상태 동기화 실패:', error);
    }
  }, [workspaceId, localMcps, hasUnsavedChanges, updateMcpsMutation]);

  return {
    localMcps,
    hasUnsavedChanges,
    toggleMcp,
    forceSync,
    isSyncing: updateMcpsMutation.isPending
  };
};
