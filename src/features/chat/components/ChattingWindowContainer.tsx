// features/chat/components/ChattingWindowContainer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChattingInputContainer from "./ChattingInputContainer";

type Message = { id: string; role: "user" | "assistant"; text: string; time?: string };

const mock: Message[] = [
  { id: "1", role: "assistant", text: "안녕하세요! 무엇을 도와드릴까요?" },
  { id: "2", role: "user", text: "채팅 스크롤 영역을 만들고 싶어요." },
];

export default function ChattingWindowContainer() {
  const [messages, setMessages] = useState<Message[]>(mock);

  // 하단으로 스크롤 유도용
  const endRef = useRef<HTMLDivElement | null>(null);

  // 메시지 추가(예시)
  const send = (text: string) =>
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    // 부모가 flex 아이템이면 min-h-0을 꼭 줘야 overflow가 제대로 동작
    <div className="flex-1 flex mx-auto justify-center items-center min-h-0 bg-surface-2 border-2 border-gray-800 rounded-2xl p-4">
      <div className="flex-1 flex flex-col h-full justify-between min-w-sm max-w-[396px] lg:max-w-3xl">
        {/* 메시지 스크롤 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} text={m.text} />
          ))}
          <div ref={endRef} />
        </div>
  
        {/* 인풋 영역 */}
        <div className="pt-3">
          <ChattingInputContainer onSend={send} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed",
          mine
            ? "bg-accent text-black rounded-br-sm"
            : "bg-white/10 text-foreground rounded-bl-sm",
        ].join(" ")}
      >
        
        <div className="font-bold -mb-0.5">{mine ? "" : "MCP HUB Assistant"}</div>
        
        {text}
      </div>
    </div>
  );
}