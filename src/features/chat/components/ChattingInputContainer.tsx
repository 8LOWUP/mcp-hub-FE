// features/chat/components/ChattingInputContainer.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ChattingInputContainer({
  onSend,
}: {
  onSend?: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const hasText = value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 자동 높이 조절
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  const send = () => {
    const v = value.trim();
    if (!v) return;
    onSend?.(v);
    setValue("");
  };

  return (
    <div
      className={[
        // 컨테이너 배경/테두리/라운드
        "w-full rounded-3xl border border-white/15 bg-background",
        // 패딩: 디바이스별
        "p-3 px-2 sm:p-3 lg:p-3",
        // 내부 레이아웃
        "flex flex-col",
        // 바깥 여백도 디바이스별로
        "",
      ].join(" ")}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="메시지를 입력하세요…"
        rows={1}
        className={[
          // 크기/텍스트/모양
          "w-full bg-transparent outline-none text-secondary break-all resize-none",
          // 텍스트 사이즈 & 내부 패딩: 반응형
          "text-sm sm:text-base lg:text-base",
          "px-3 sm:px-4 py-1.5",
          // 자동 리사이즈 + 최대높이 도달 시 내부 스크롤
          "resize-none overflow-y-auto",
          // 최대 높이: 디바이스별
          "max-h-[140px] sm:max-h-[200px] lg:max-h-[300px]",
          // 색상 토큰
          "placeholder:text-foreground/40",
        ].join(" ")}
      />

      <div className="flex w-full items-center justify-between">
        {/* 좌측: 모달(모델 선택) 버튼 — 화살표 아이콘 */}
        <button
          type="button"
          aria-label="모델 선택 열기"
          className="flex items-center cursor-pointer gap-1 rounded-xl sm:ml-1 px-3 pr-2 py-1 hover:bg-surface-4 transition"
        >
          <div className="text-sm sm:text-base">GPT-4</div>
          <svg
            viewBox="0 0 24 24"
            className="size-6 sm:size-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* 우측: 전송 버튼 — 입력 있으면 노란색 활성화 */}
        <button
          type="button"
          onClick={send}
          disabled={!hasText}
          aria-disabled={!hasText}
          aria-label="Send"
          className={[
            "grid place-items-center rounded-full transition",
            // 크기: 반응형
            "size-7 sm:size-9",
            // 여백: 반응형
            "mx-2 sm:mx-3 lg:mx-4",
            // 활성/비활성 스타일
            hasText
              ? "bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] text-black"
              : "bg-foreground/10 opacity-40 cursor-not-allowed",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
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
    </div>
  );
}