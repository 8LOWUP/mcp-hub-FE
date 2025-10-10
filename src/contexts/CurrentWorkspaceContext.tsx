'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CurrentWorkspaceContextType {
  currentWorkspaceId: string | null;
  openWorkspace: (workspaceId: string) => void;
  startNewChat: () => void;
  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

const CurrentWorkspaceContext = createContext<CurrentWorkspaceContextType | undefined>(undefined);

export const useCurrentWorkspace = () => {
  const context = useContext(CurrentWorkspaceContext);
  if (context === undefined) {
    throw new Error('useCurrentWorkspace must be used within a CurrentWorkspaceProvider');
  }
  return context;
};

export const CurrentWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const openWorkspace = useCallback((workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
  }, []);

  const startNewChat = useCallback(() => {
    const newWorkspaceId = `new-${Date.now()}`;
    
    // 임시 워크스페이스 객체 생성
    const tempWorkspace = {
      workspaceId: newWorkspaceId,
      title: "새 대화",
      createdAt: new Date().toISOString(),
      isTemporary: true
    };
    
    // React Query 캐시 업데이트 - 워크스페이스 목록에 새 임시 워크스페이스 추가
    queryClient.setQueryData(['workspaces'], (oldData: any) => {
      if (!oldData) {
        return { result: [tempWorkspace] };
      }
      
      return {
        ...oldData,
        result: [tempWorkspace, ...oldData.result]
      };
    });
    
    // 현재 워크스페이스 ID 설정
    setCurrentWorkspaceId(newWorkspaceId);
  }, [queryClient]);

  return (
    <CurrentWorkspaceContext.Provider value={{
      currentWorkspaceId,
      openWorkspace,
      startNewChat,
      isSending,
      setIsSending,
    }}>
      {children}
    </CurrentWorkspaceContext.Provider>
  );
};