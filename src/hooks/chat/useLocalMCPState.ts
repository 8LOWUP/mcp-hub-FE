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
  }, [memoizedInitialMcps]);

  // 800ms debounce로 서버 동기화
  const debouncedSyncToServer = useDebouncedCallback(
    async (mcps: mcpInfo[]) => {
      if (!workspaceId || workspaceId.startsWith('new-')) return;
      
      try {
        console.log('🔄 MCP 상태 서버 동기화:', { workspaceId, mcps });
        console.log('📤 API 요청을 보냅니다! (debounce 800ms 후)');
        await updateMcpsMutation.mutateAsync({
          workspaceId,
          data: { mcps }
        });
        setHasUnsavedChanges(false);
        console.log('✅ MCP 상태 서버 동기화 완료');
      } catch (error) {
        console.error('❌ MCP 상태 서버 동기화 실패:', error);
        // 실패 시 이전 상태로 롤백
        setLocalMcps(memoizedInitialMcps);
      }
    },
    800
  );

  // MCP 상태 토글
  const toggleMcp = useCallback((mcpId: string, active: boolean) => {
    console.log(`🔄 MCP 토글: ${mcpId} → ${active ? '활성화' : '비활성화'} (로컬 상태 즉시 변경)`);
    
    setLocalMcps(prev => {
      const updated = prev.map(mcp =>
        mcp.id === mcpId ? { ...mcp, active } : mcp
      );
      
      setHasUnsavedChanges(true);
      console.log('⏰ 800ms debounce 타이머 시작...');
      debouncedSyncToServer(updated);
      
      return updated;
    });
  }, [debouncedSyncToServer]);

  // 강제 동기화 (채팅 전송 시 사용)
  const forceSync = useCallback(async () => {
    if (!workspaceId || workspaceId.startsWith('new-') || !hasUnsavedChanges) return;
    
    try {
      await updateMcpsMutation.mutateAsync({
        workspaceId,
        data: { mcps: localMcps }
      });
      setHasUnsavedChanges(false);
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
