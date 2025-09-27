// components/ChatInput.tsx
"use client";

import { useCallback, useState } from "react";

type ChatInputProps = {
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  loading?: boolean;
  onOpenModal?: () => void;
  onSend?: (text: string) => void;
};

export default function ChatInput({
  placeholder = "Type your message here...",
  defaultValue = "",
  disabled = false,
  loading = false,
  onOpenModal,
  onSend,
}: ChatInputProps) {
  const [text, setText] = useState(defaultValue);

  const send = useCallback(() => {
    const payload = text.trim();
    if (!payload || loading || disabled) return;
    onSend?.(payload);
    setText("");
  }, [text, loading, disabled, onSend]);

  return (
    <div
      className={[
        // 바탕 & 형태
        "w-full rounded-full bg-background text-foreground",
        // 테두리 & 포커스
        "border border-white/15 dark:border-white/10",
        "focus-within:border-primary/40 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,.35)]",
        // 내부 패딩
        "px-3 sm:px-4 h-12 sm:h-14",
        // 레이아웃
        "flex items-center gap-2 sm:gap-3",
        // 비활성화
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {/* 좌측: 모달 버튼 */}
      <button
        type="button"
        onClick={onOpenModal}
        disabled={disabled}
        aria-label="Open tools / modal"
        className="shrink-0 grid place-items-center rounded-full size-8 sm:size-9 hover:bg-foreground/5 active:scale-[0.98] transition"
      >
        {/* 아이콘 (예: 메뉴 아이콘) */}
        <svg
          viewBox="0 0 24 24"
          className="size-5 sm:size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 중앙: 인풋 */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none placeholder:text-foreground/40 min-w-0 text-sm sm:text-base"
      />

      {/* 우측: 전송 버튼 */}
      <button
        type="button"
        onClick={send}
        disabled={disabled || loading || text.trim().length === 0}
        aria-label="Send message"
        className={[
          "shrink-0 grid place-items-center rounded-full size-8 sm:size-10",
          "bg-foreground/10 hover:bg-foreground/15",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition active:scale-[0.98]",
        ].join(" ")}
      >
        {/* 종이비행기 아이콘 */}
        <svg
          viewBox="0 0 24 24"
          className="size-4 sm:size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
}