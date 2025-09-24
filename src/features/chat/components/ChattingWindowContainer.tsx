"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import ChattingInputContainer from "./ChattingInputContainer";
import { useChatStore } from "@/store/chat/chat-store";

type Role = "user" | "assistant";
type BubbleProps = { role: Role; text: string };

export default function ChattingWindowContainer() {
  const endRef = useRef<HTMLDivElement | null>(null);

  // ✅ Zustand
  const currentWorkspaceId  = useChatStore((s) => s.currentWorkspaceId);
  const messagesByWorkspace = useChatStore((s) => s.messagesByWorkspace);
  const sendingByWorkspace  = useChatStore((s) => s.sendingByWorkspace);
  const sendMessage         = useChatStore((s) => s.sendMessage);

  const messages  = (currentWorkspaceId ? messagesByWorkspace[currentWorkspaceId] : undefined) ?? [];
  const isSending = currentWorkspaceId ? !!sendingByWorkspace[currentWorkspaceId] : false;

  const isEmpty = messages.length === 0;
  const isNew   = currentWorkspaceId?.startsWith("new-") ?? false;

  // 새 메시지/로딩 변화 시 하단 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isSending]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-surface-2 p-4 min-w-[350px]">
      <div className="relative mx-auto flex-1 w-full lg:max-w-3xl h-full">

        {/* ✅ 스크롤 영역: 입력창 높이만큼 패딩으로 공간 확보 */}
        <div
          className={clsx(
            "flex flex-col h-full w-full overflow-y-auto transition-all duration-300 px-2",
            // 비어있을 때는 살짝 페이드/상단 여백
            isEmpty ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
          )}
          // 입력창 공간 확보 (하단 패딩: 입력 박스 높이)
          style={{ paddingBottom: isEmpty ? 0 : "7.5rem" }} // 약 h-28 정도
        >
          <div className="max-w-2xl mx-auto w-full px-2 py-1">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} text={m.text} />
            ))}

            {/* ✅ 로딩 중이면 보조 스켈레톤 버블 */}
            {isSending && <AssistantSkeletonBubble />}

            <div ref={endRef} />
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
            {isNew ? "새 대화를 시작해보세요" : "아직 대화가 없어요"}
          </div>
          <p className="text-sm text-foreground/70 mb-6">
            메시지를 입력하면 대화가 시작됩니다. 우측 MCP를 켜서 도구를 함께 사용해도 좋아요.
          </p>

          <div className="flex gap-2 mb-6">
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
          </div>
        </div>

        {/* ✅ 입력창: 같은 DOM 유지, 위치만 transform으로 이동 */}
        <div
          className={clsx(
            "absolute left-1/2 -translate-x-1/2 w-full max-w-2xl bottom-0 transition-transform duration-300",
            isEmpty ? "translate-y-[-20vh]" : "translate-y-0"
          )}
        >
          <ChattingInputContainer onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, text }: BubbleProps) {
  const mine = role === "user";
  return (
    <div className={clsx("flex mb-2", mine ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words transition-colors duration-200",
          mine ? "bg-accent text-black rounded-br-sm" : "bg-white/10 text-foreground rounded-bl-sm"
        )}
      >
        {!mine && <div className="font-bold mb-1">MCP HUB Assistant</div>}
        <div>{text}</div>
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