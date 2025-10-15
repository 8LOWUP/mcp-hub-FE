"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import ChatContainer from "./ChatContainer";
import AssistantSkeletonBubble from "./skeleton/AssistantSkeletonBubble";
import LoadingSkeleton from "./skeleton/LoadingSkeleton";
import { useCurrentWorkspace } from "@/contexts/CurrentWorkspaceContext";
import { useWorkspaceChats, useSendWorkspaceChat } from "@/hooks/chat/useWorkspaces";
import { useLocalMCPState } from "@/hooks/chat/useLocalMCPState";
import { useMcpSelectionStore } from "@/store/chat/mcp-selection-store";
import { useWorkspaceDetail, useCreateWorkspace } from "@/hooks/chat/useWorkspaces";
import type { Role, WorkspaceSummary, mcpInfo } from "@/types/chat/chat-type";
import type { ModelInfo } from "@/hooks/chat/useModelManager";

type BubbleProps = { role: Role; text: string; isOptimistic?: boolean; isNew?: boolean; onScrollToBottom?: () => void; onTypingComplete?: () => void };

type ChattingWindowContainerProps = {
  availableModels: ModelInfo[];
  selectedModel: ModelInfo | null;
  modelsLoading: boolean;
  selectModel: (modelId: string) => void;
};

export default function ChattingWindowContainer({
  availableModels,
  selectedModel,
  modelsLoading,
  selectModel,
}: ChattingWindowContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
  const { localMcps, forceSync } = useLocalMCPState(
    currentWorkspaceId,
    workspaceMcps
  );

  // 서버 메시지와 낙관적 메시지를 합친 최종 메시지 목록
  const serverMessages = (chatData as any)?.content || [];

  const isNew = currentWorkspaceId?.startsWith("new-") ?? false;

  // 이전 메시지 개수를 추적하기 위한 ref
  const prevMessageCountRef = useRef(0);
  // 메시지 전송 후 새 응답이 왔는지 추적
  const [hasNewResponse, setHasNewResponse] = useState(false);

  const allMessages = useMemo(() => {
    // 서버 메시지 매핑
    const serverMapped = serverMessages.map((msg: any, index: number) => ({
      id: `server-${index}`,
      role: msg.isRequest ? "user" : "assistant" as "user" | "assistant",
      text: msg.chatMessage,
      isOptimistic: false,
      isNew: index >= prevMessageCountRef.current && hasNewResponse // 새로 추가된 메시지이고 새 응답이 있을 때만
    }));
    
    // 사용자 메시지가 있으면 임시 메시지를 마지막에 추가 (새 채팅과 기존 채팅 모두)
    if (tempUserMessage) {
      const tempMessage = {
        id: 'temp-user-message',
        role: "user" as "user" | "assistant",
        text: tempUserMessage,
        isOptimistic: true,
        isNew: false // 임시 메시지는 타이핑 효과 없음
      };
      
      // 임시 메시지를 배열 마지막에 추가
      return [...serverMapped, tempMessage];
    }
    
    // 메시지 개수 업데이트
    prevMessageCountRef.current = serverMapped.length;
    
    return serverMapped;
  }, [serverMessages, currentWorkspaceId, isNew, tempUserMessage, hasNewResponse]);

  const isSending = sendChatMutation.isPending || isSendingMessage || isCreatingWorkspace;
  
  // Context에 isSending 상태 동기화
  useEffect(() => {
    setIsSending(isSending);
  }, [isSending, setIsSending]);

  // 워크스페이스 변경 시 상태 리셋
  useEffect(() => {
    setHasNewResponse(false);
    // 워크스페이스 전환 시, 현재 서버 메시지 수를 기준으로 설정하여
    // 기존 메시지에는 타이핑 애니메이션이 적용되지 않도록 한다
    prevMessageCountRef.current = serverMessages.length;
  }, [currentWorkspaceId]);

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
      // 임시 메시지 추가 직후, 렌더/레이아웃 완료 시 하단으로 스크롤
      scheduleScrollToBottom();
      setHasNewResponse(true); // 새 응답이 올 예정임을 표시
      
      try {
        setIsCreatingWorkspace(true);
        setIsSendingMessage(true);
        
        // 새 워크스페이스용 MCP 리스트: 우측 패널 선택(전역 스토어) → 없으면 localMcps
        const storeMcps = useMcpSelectionStore.getState().selectedMcps;
        console.log('🧩 localMcps (raw):', localMcps);
        console.log('🧩 storeMcps (raw):', storeMcps);
        const source = Array.isArray(storeMcps) && storeMcps.length > 0 ? storeMcps : localMcps;
        const mcpsForNewWorkspace: mcpInfo[] = (Array.isArray(source) ? source : [])
          .filter((m) => !!m && typeof m.id !== 'undefined' && m.active === true)
          .map((m) => ({ id: String(m.id), active: true }));
        const finalModelId = modelId || 'GPT';
        
        const requestData = {
          llmId: finalModelId,
          mcps: mcpsForNewWorkspace,
          chatMessage: text
        };
        
        console.log('🚀 워크스페이스 생성 요청 데이터:', {
          llmId: finalModelId,
          mcps: mcpsForNewWorkspace,
          chatMessage: text,
          mcpsType: typeof mcpsForNewWorkspace,
          mcpsLength: mcpsForNewWorkspace.length,
          mcpsPreview: mcpsForNewWorkspace.slice(0, 5)
        });
        
        const createResponse = await createWorkspaceMutation.mutateAsync(requestData);
        console.log('✅ 워크스페이스 생성 응답:', createResponse);
        
        const newWorkspaceId = createResponse.result.workspaceId;
        openWorkspace(newWorkspaceId);
        
        setTempUserMessage(null);
        setIsCreatingWorkspace(false);
        setIsSendingMessage(false);
        
      } catch (error: any) {
        console.error('워크스페이스 생성 실패:', error?.response?.data ?? error);
        setTempUserMessage(null);
        setHasNewResponse(false); // 실패 시 리셋
        setIsCreatingWorkspace(false);
        setIsSendingMessage(false);
      }
      
      return;
    }

    // 사용자가 보낸 메시지를 임시로 저장 (UI에 표시하기 위해)
    setTempUserMessage(text);
    // 임시 메시지 추가 직후 하단으로 스크롤 (렌더/레이아웃 이후)
    scheduleScrollToBottom();   
    setIsSendingMessage(true);
    setHasNewResponse(true); // 새 응답이 올 예정임을 표시

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
      setHasNewResponse(false); // 실패 시 리셋
    } finally {
      setIsSendingMessage(false);
    }
  }, [isSendingMessage, createWorkspaceMutation, openWorkspace, sendChatMutation, forceSync, currentWorkspaceId, startNewChat]);

  // 스크롤 함수 - 두 가지 방법 모두 사용
  const scrollToBottom = useCallback(() => {
    // 방법 1: endRef 사용 (부드러운 스크롤)
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // 렌더링과 레이아웃 반영이 끝난 뒤 하단으로 스크롤하기 위한 스케줄러
  const scheduleScrollToBottom = useCallback(() => {
    // 두 번의 rAF로 레이아웃 반영 이후 호출 보장
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });
  }, [scrollToBottom]);

  // 타이핑 완료 시 hasNewResponse 리셋
  const handleTypingComplete = useCallback(() => {
    setHasNewResponse(false);
  }, []);

  // 새 메시지/로딩 변화 시 하단 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [isLoading, isSending, scrollToBottom]);

  // 서버 메시지 수 증가 시에도 렌더 안정화 후 하단으로 스크롤
  const serverCountRef = useRef(serverMessages.length);
  useEffect(() => {
    if (serverMessages.length > serverCountRef.current) {
      scheduleScrollToBottom();
    }
    serverCountRef.current = serverMessages.length;
  }, [serverMessages.length, scheduleScrollToBottom]);

  // (되돌림) ResizeObserver 제거

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-surface-5 p-4 min-w-[350px]">
      <div className="relative mx-auto flex-1 w-full lg:max-w-3xl h-full">

        {/* ✅ 스크롤 영역: 입력창 높이만큼 패딩으로 공간 확보 */}
        <div
          ref={scrollContainerRef}
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
                      isNew={message.isNew}
                      onScrollToBottom={scrollToBottom}
                      onTypingComplete={handleTypingComplete}
                    />
                  );
                })}
                {isSending && <AssistantSkeletonBubble />}
                <div 
                  ref={endRef}
                />
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
          <ChatContainer 
            onSend={sendMessage} 
            isSending={isSending}
            availableModels={availableModels}
            selectedModel={selectedModel}
            modelsLoading={modelsLoading}
            selectModel={selectModel}
          />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, text, isOptimistic = false, isNew = false, onScrollToBottom, onTypingComplete }: BubbleProps) {
  const mine = role === "user";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // \n을 실제 줄바꿈으로 변환하는 함수
  const formatText = (text: string) => {
    return text.split('\\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\\n').length - 1 && <br />}
      </span>
    ));
  };

  // 타이핑 효과 (새로운 AI 메시지만)
  useEffect(() => {
    if (mine || isOptimistic || !isNew) {
      // 사용자 메시지, 낙관적 메시지, 기존 메시지는 즉시 표시
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    // 새로운 AI 메시지만 타이핑 효과 적용
    setIsTyping(true);
    setDisplayedText("");
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        // 타이핑 완료 시 콜백 호출
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, 30); // 30ms마다 한 글자씩 (자연스러운 타이핑 속도)

    return () => clearInterval(typingInterval);
  }, [text, mine, isOptimistic, isNew, onTypingComplete]);

  // 타이핑 중일 때 스크롤 자동 업데이트 (더 자주 업데이트)
  useEffect(() => {
    if (isTyping && onScrollToBottom) {
      // 50ms마다 스크롤 업데이트 (더 부드럽게)
      const scrollInterval = setInterval(() => {
        onScrollToBottom();
      }, 50);
      
      return () => clearInterval(scrollInterval);
    }
  }, [isTyping, onScrollToBottom]);

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
          {formatText(displayedText)}
          {isTyping && <span className="inline-block w-0.5 h-4 bg-white/80 animate-pulse ml-1">|</span>}
        </div>
      </div>
    </div>
  );
}

// moved to ./skeleton components