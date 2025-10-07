import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { workspacesApi } from '@/services/chat/apis';
import type { 
  postWorkspaceCreateRequestBody,
  patchWorkspaceTitleEditRequestBody,
  patchMCPActiveEditRequestBody
} from '@/types/chat/chat-type';

// 워크스페이스 목록 조회
export const useWorkspaces = () => {
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => {
      console.log('🌐 워크스페이스 목록 API 호출 시작');
      return workspacesApi.getWorkspaces();
    },
    select: (data) => {
      console.log('📋 워크스페이스 목록 API 응답:', data);
      console.log('📋 워크스페이스 목록 결과:', data.result);
      
      // 서버에서 받은 워크스페이스만 반환 (임시 워크스페이스는 React Query 캐시에서 관리)
      console.log('📋 서버 워크스페이스 목록:', data.result);
      
      return data.result;
    },
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ 워크스페이스 목록 로드 성공:', query.data);
    }
    if (query.error) {
      console.error('❌ 워크스페이스 목록 로드 실패:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

// 임시 워크스페이스는 이제 React Query 캐시에서만 관리됩니다.

// 워크스페이스 상세 조회
export const useWorkspaceDetail = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspacesApi.getWorkspaceDetail(workspaceId!),
    select: (data) => data.result,
    enabled: !!workspaceId,
  });
};

// 워크스페이스 채팅 로그 조회
export const useWorkspaceChats = (workspaceId: string | null, page: number = 0, size: number = 50) => {
  const query = useQuery({
    queryKey: ['workspace-chats', workspaceId, page, size],
    queryFn: () => {
      console.log('🌐 워크스페이스 채팅 로그 API 호출:', { workspaceId, page, size });
      return workspacesApi.getWorkspaceChats(workspaceId!, page, size);
    },
    select: (data) => {
      console.log('📋 워크스페이스 채팅 로그 API 응답:', data);
      console.log('📋 워크스페이스 채팅 로그 결과:', data.result);
      return data.result;
    },
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ 워크스페이스 채팅 로그 로드 성공:', query.data);
    }
    if (query.error) {
      console.error('❌ 워크스페이스 채팅 로그 로드 실패:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

// 워크스페이스 생성
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: postWorkspaceCreateRequestBody) => workspacesApi.createWorkspace(data),
    onSuccess: async (data) => {
      console.log('✅ 워크스페이스 생성 성공, 목록 새로고침 시작:', data);
      console.log('📊 전체 응답 데이터:', JSON.stringify(data, null, 2));
      console.log('📊 result 객체:', data.result);
      
      // 새로운 워크스페이스 객체 생성
      const newWorkspace = {
        workspaceId: data.result.workspaceId,
        title: data.result.title,
        createdAt: data.result.createdAt
      };
      
      console.log('🆕 새 워크스페이스 객체:', newWorkspace);
      
      // 기존 캐시 데이터 가져오기
      const oldData = queryClient.getQueryData(['workspaces']) as any;
      console.log('📋 기존 캐시 데이터:', oldData);
      
      if (!oldData) {
        console.log('📋 캐시가 비어있음, 새 워크스페이스만 추가');
        queryClient.setQueryData(['workspaces'], { result: [newWorkspace] });
      } else {
        // 기존 목록에서 임시 워크스페이스 제거하고 새 워크스페이스 추가
        const updatedData = {
          ...oldData,
          result: [newWorkspace, ...(oldData.result || []).filter((w: any) => !w.isTemporary)]
        };
        console.log('📋 업데이트된 캐시 데이터:', updatedData);
        queryClient.setQueryData(['workspaces'], updatedData);
      }
      
      // 추가로 서버에서 최신 데이터 가져오기
      await queryClient.refetchQueries({ queryKey: ['workspaces'] });
      
      console.log('🔄 워크스페이스 목록 새로고침 완료');
    },
  });
};

// 워크스페이스 제목 수정
export const useUpdateWorkspaceTitle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: patchWorkspaceTitleEditRequestBody }) => 
      workspacesApi.updateWorkspaceTitle(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      // 워크스페이스 목록과 상세 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
    },
  });
};

// 워크스페이스 MCP 활성화 수정
export const useUpdateWorkspaceMcps = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: patchMCPActiveEditRequestBody }) => 
      workspacesApi.toggleWorkspaceMcps(workspaceId, data),
    onMutate: async ({ workspaceId, data }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['workspace', workspaceId] });
      
      // 이전 데이터 백업
      const previousWorkspace = queryClient.getQueryData(['workspace', workspaceId]);
      
      // 낙관적 업데이트: 즉시 UI 업데이트
      queryClient.setQueryData(['workspace', workspaceId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: {
            ...old.result,
            mcps: data.mcps
          }
        };
      });
      
      // 롤백을 위한 이전 데이터 반환
      return { previousWorkspace };
    },
    onError: (err, { workspaceId }, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousWorkspace) {
        queryClient.setQueryData(['workspace', workspaceId], context.previousWorkspace);
      }
    },
    onSettled: (_, __, { workspaceId }) => {
      // 성공/실패 관계없이 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
    },
  });
};

// 워크스페이스 삭제
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (workspaceId: string) => workspacesApi.deleteWorkspace(workspaceId),
    onSuccess: (_, workspaceId) => {
      // 워크스페이스 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      // 삭제된 워크스페이스 캐시 제거
      queryClient.removeQueries({ queryKey: ['workspace', workspaceId] });
      queryClient.removeQueries({ queryKey: ['workspace-chats', workspaceId] });
    },
  });
};

// 워크스페이스 채팅 전송
export const useSendWorkspaceChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: { chatMessage: string } }) => 
      workspacesApi.postSendWorkspaceChats(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      // 채팅 로그 새로고침
      queryClient.invalidateQueries({ queryKey: ['workspace-chats', workspaceId] });
    },
  });
};
