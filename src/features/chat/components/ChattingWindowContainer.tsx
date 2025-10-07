"use client";

import { useEffect, useRef, useMemo, useState, useCallback, memo } from "react";
import clsx from "clsx";
import ChatContainer from "./ChatContainer";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useWorkspaceChats, useSendWorkspaceChat } from "@/hooks/chat/useWorkspaces";
import { useLocalMCPState } from "@/hooks/chat/useLocalMCPState";
import { useWorkspaceDetail, useCreateWorkspace } from "@/hooks/chat/useWorkspaces";
import type { Role, WorkspaceSummary } from "@/types/chat/chat-type";

type BubbleProps = { role: Role; text: string; isOptimistic?: boolean };

const ChattingWindowContainer = memo(function ChattingWindowContainer() {
  const endRef = useRef<HTMLDivElement | null>(null);
  // 채팅 전송 중인지 확인하는 상태
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  // 워크스페이스 생성 중인지 확인하는 상태
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // 사용자가 보낸 메시지를 임시로 저장 (새 채팅과 기존 채팅 모두)
  const [tempUserMessage, setTempUserMessage] = useState<string | null>(null);

  // ✅ TanStack Query
  const { currentWorkspaceId, openWorkspace, startNewChat, isSending: contextIsSending, setIsSending } = useCurrentWorkspace();

  const { data: chatData, isLoading, error } = useWorkspaceChats(
    currentWorkspaceId && !currentWorkspaceId.startsWith('new-') ? currentWorkspaceId : null
  );
  const { data: workspaceDetail } = useWorkspaceDetail(
    currentWorkspaceId && !currentWorkspaceId.startsWith('new-') ? currentWorkspaceId : null
  );

  const sendChatMutation = useSendWorkspaceChat();
  const createWorkspaceMutation = useCreateWorkspace();

  // MCP 상태를 메모이제이션하여 무한 루프 방지
  const workspaceMcps = useMemo(() => workspaceDetail?.mcps ?? [{}], [workspaceDetail?.mcps]);

  // MCP 상태 동기화를 위한 훅
  const { forceSync } = useLocalMCPState(
    currentWorkspaceId,
    workspaceMcps
  );

  // 서버 메시지와 낙관적 메시지를 합친 최종 메시지 목록
  const serverMessages = (chatData as any)?.content || [];

  const isNew = currentWorkspaceId?.startsWith("new-") ?? false;

  const allMessages = useMemo(() => {
    // 서버 메시지 매핑
    const serverMapped = serverMessages.map((msg: any, index: number) => ({
      id: `server-${index}`,
      role: msg.isRequest ? "user" : "assistant" as "user" | "assistant",
      text: msg.chatMessage,
      isOptimistic: false
    }));
    
    // 사용자 메시지가 있으면 임시 메시지를 마지막에 추가 (새 채팅과 기존 채팅 모두)
    if (tempUserMessage) {
      const tempMessage = {
        id: 'temp-user-message',
        role: "user" as "user" | "assistant",
        text: tempUserMessage,
        isOptimistic: true
      };
      
      // 임시 메시지를 배열 마지막에 추가
      return [...serverMapped, tempMessage];
    }
    
    return serverMapped;
  }, [serverMessages, currentWorkspaceId, isNew, tempUserMessage]);

  const isSending = sendChatMutation.isPending || isSendingMessage || isCreatingWorkspace;
  
  // Context에 isSending 상태 동기화
  useEffect(() => {
    setIsSending(isSending);
  }, [isSending, setIsSending]);

  const isEmpty = allMessages.length === 0;


  // 메시지 전송 함수 (메모이제이션으로 최적화)
  const sendMessage = useCallback(async (text: string, modelId?: string) => {
    // 이미 전송 중이면 무시
    if (isSendingMessage) {
      return;
    }

    // 최신 currentWorkspaceId 참조
    const latestWorkspaceId = currentWorkspaceId;

    // currentWorkspaceId가 null이거나 임시 워크스페이스면 새 워크스페이스 생성
    if (!latestWorkspaceId || latestWorkspaceId.startsWith('new-')) {
      // currentWorkspaceId가 null이면 임시 워크스페이스 생성
      if (!latestWorkspaceId) {
        startNewChat();
      }
      
      // 임시 워크스페이스 생성 및 메시지 전송 로직
      setTempUserMessage(text);
      
      try {
        setIsCreatingWorkspace(true);
        setIsSendingMessage(true);
        
        const mcpsForNewWorkspace = [{}];
        const finalModelId = modelId || 'GPT';
        
        const requestData = {
          llmId: finalModelId,
          mcps: mcpsForNewWorkspace,
          chatMessage: text
        };
        
        const createResponse = await createWorkspaceMutation.mutateAsync(requestData);
        
        const newWorkspaceId = createResponse.result.workspaceId;
        openWorkspace(newWorkspaceId);
        
        setTempUserMessage(null);
        setIsCreatingWorkspace(false);
        setIsSendingMessage(false);
        
      } catch (error) {
        console.error('워크스페이스 생성 실패:', error);
        setTempUserMessage(null);
        setIsCreatingWorkspace(false);
        setIsSendingMessage(false);
      }
      
      return;
    }

    // 사용자가 보낸 메시지를 임시로 저장 (UI에 표시하기 위해)
    setTempUserMessage(text);    
    setIsSendingMessage(true);

    try {
      // 채팅 전송 전에 MCP 상태 강제 동기화
      await forceSync();

      await sendChatMutation.mutateAsync({
        workspaceId: latestWorkspaceId,
        data: {
          chatMessage: text,
          ...(modelId && { llmId: modelId }) // 모델 ID가 있으면 포함
        }
      });

      // 채팅 전송 성공 시 임시 메시지 제거
      setTempUserMessage(null);

    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setTempUserMessage(null);
    } finally {
      setIsSendingMessage(false);
    }
  }, [isSendingMessage, createWorkspaceMutation, openWorkspace, sendChatMutation, forceSync]);

  // 새 메시지/로딩 변화 시 하단 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isLoading, isSending]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-surface-5 p-4 min-w-[350px]">
      <div className="relative mx-auto flex-1 w-full lg:max-w-3xl h-full">

        {/* ✅ 스크롤 영역: 입력창 높이만큼 패딩으로 공간 확보 */}
        <div
          className={clsx(
            "flex flex-col h-full w-full overflow-y-scroll transition-all duration-300 px-2",
            // 입력창 공간 확보 (하단 패딩: 입력 박스 높이)
            "pb-28 scrollbar-gutter-stable scrollbar-gutter-both-edges"
          )}
        >
          <div className="max-w-2xl mx-auto w-full px-2 py-1 overflow-y-scroll">
            {(isLoading && !isNew) || (isCreatingWorkspace && !tempUserMessage) ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">
                  <p className="text-red-500 mb-2">대화 내용을 불러오는데 실패했습니다.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-blue-500 underline"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : (
              <>
                {allMessages.map((message: any) => {
                  return (
                    <MessageBubble
                      key={message.id}
                      role={message.role}
                      text={message.text}
                      isOptimistic={message.isOptimistic}
                    />
                  );
                })}
                {isSending && <AssistantSkeletonBubble />}
                <div ref={endRef} />
              </>
            )}
          </div>
        </div>

        {/* ✅ 빈 상태 오버레이 (메시지 생기면 부드럽게 사라짐) */}
        <div
          className={clsx(
            "absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300",
            isEmpty ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="text-2xl font-bold mb-2">
            {isNew ? "새 채팅을 시작할까요?" : "대화를 시작해보세요"}
          </div>
          <p className="text-sm text-foreground/70 mb-6">
            {isNew
              ? "아래 입력창에 메시지를 입력하여 새로운 대화를 시작하세요. 원하는 모델을 선택할 수 있습니다."
              : "메시지를 입력하면 대화가 시작됩니다. 우측 MCP를 켜서 도구를 함께 사용해도 좋아요."
            }
          </p>

          <div className="flex gap-2 mb-6">
            {isNew ? (
              <>
                <button
                  className="px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-sm"
                  onClick={() => sendMessage("안녕하세요! 새로운 대화를 시작합니다.")}
                >
                  안녕하세요!
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-sm"
                  onClick={() => sendMessage("오늘 날씨는 어떤가요?")}
                >
                  날씨 알려줘
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-sm"
                  onClick={() => sendMessage("코딩 도움이 필요해요")}
                >
                  코딩 도움
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-sm"
                  onClick={() => sendMessage("오늘 할 일 추천해줘")}
                >
                  오늘 할 일 추천해줘
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-sm"
                  onClick={() => sendMessage("Next.js 성능 최적화 팁 알려줘")}
                >
                  Next.js 최적화 팁
                </button>
              </>
            )}
          </div>
        </div>

        {/* ✅ 입력창: 같은 DOM 유지, 위치만 transform으로 이동 */}
        <div
          className={clsx(
            "absolute left-1/2 -translate-x-1/2 w-full max-w-2xl bottom-0 transition-transform duration-300"
          )}
        >
          <ChatContainer onSend={sendMessage} isSending={isSending} />
        </div>
      </div>
    </div>
  );
});

function MessageBubble({ role, text, isOptimistic = false }: BubbleProps) {
  const mine = role === "user";

  // \n을 실제 줄바꿈으로 변환하는 함수
  const formatText = (text: string) => {
    return text.split('\\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={clsx("flex mb-2", mine ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed break-words transition-colors duration-200",
          mine ? "bg-accent text-black rounded-br-sm" : "bg-white/10 text-foreground rounded-bl-sm"
        )}
      >
        {!mine && <div className="font-bold mb-1">MCP HUB Assistant</div>}
        <div
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {formatText(text)}
        </div>
      </div>
    </div>
  );
}

function AssistantSkeletonBubble() {
  return (
    <div className="flex justify-start mb-2">
      <div className="rounded-2xl px-5 py-3 max-w-[80%] rounded-bl-sm bg-white/10">
        <div className="animate-pulse">
          <div className="h-4 w-40 bg-white/20 rounded mb-2" />
          <div className="h-4 w-56 bg-white/10 rounded mb-2" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white"></div>
    </div>
  );
}

export default ChattingWindowContainer;