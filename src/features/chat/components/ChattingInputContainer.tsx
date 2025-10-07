// features/chat/components/ChattingInputContainer.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { useModalStore } from "@/features/chat/modal/modal-store";
import ModelSelectorModal from "@/features/chat/modal/ModelSelectorModal";

const ChattingInputContainer = memo(function ChattingInputContainer({
  onSend,
  isSending = false,
  availableModels = [],
  selectedModel,
  modelsLoading = false,
  selectModel,
}: {
  onSend?: (text: string, modelId?: string) => void;
  isSending?: boolean;
  availableModels?: any[];
  selectedModel?: any;
  modelsLoading?: boolean;
  selectModel?: (id: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 확인
  const hasText = value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const { openModelSelectorModal, modelSelectorModal, closeModelSelectorModal } = useModalStore();
  const modelBtnRef = useRef<HTMLButtonElement | null>(null);
  
  // 현재 선택된 모델 이름 (메모이제이션)
  const currentModel = useMemo(() => selectedModel?.name || 'GPT-5', [selectedModel?.name]);

  // 자동 높이 조절
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  const send = useCallback(() => {
    const v = value.trim();
    
    if (!v || isComposing || isSending) {
      return; // 한글 입력 중이거나 전송 중이면 전송하지 않음
    }
    
    // 현재 선택된 모델 ID 사용
    const modelId = selectedModel?.id || 'GPT';
    onSend?.(v, modelId);
    setValue("");
  }, [value, isComposing, isSending, onSend, selectedModel?.id]);

  // 한글 입력 시작
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  // 한글 입력 종료
  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // 키보드 이벤트 처리 (한글 입력 고려)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isComposing && !isSending) { // 한글 입력 중이 아니고 전송 중이 아니면 전송
        send();
      }
    }
  }, [send, isComposing, isSending]);

  const handleModelSelect = useCallback((modelId: string) => {
    selectModel?.(modelId);
    closeModelSelectorModal();
  }, [selectModel, closeModelSelectorModal]);

  const handleModelButtonClick = useCallback(() => {
    const rect = modelBtnRef.current?.getBoundingClientRect();
    if (rect) openModelSelectorModal(currentModel.toLowerCase().replace(/\s+/g, '-'), rect);
  }, [openModelSelectorModal, currentModel]);


  return (
    <div
      className={[
        // 컨테이너 배경/테두리/라운드
        "w-full rounded-3xl border border-white/15 bg-background p-3",
        // 내부 레이아웃
        "flex flex-col",
      ].join(" ")}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="메시지를 입력하세요…"
        rows={1}
        className={[
          // 크기/텍스트/모양
          "w-full bg-transparent outline-none text-secondary break-all resize-none",
          // 텍스트 사이즈 & 내부 패딩: 반응형
          "text-base px-4 py-1",
          // 자동 리사이즈 + 최대높이 도달 시 내부 스크롤
          "resize-none overflow-y-auto",
          // 최대 높이: 디바이스별
          "max-h-[140px] ",
          // 색상 토큰
          "placeholder:text-foreground/40",
        ].join(" ")}
      />

      <div className="flex w-full items-center justify-between">
        {/* 좌측: 모델 선택 버튼 */}
        <button
          type="button"
          ref={modelBtnRef}
          onClick={handleModelButtonClick}
          aria-label="모델 선택 열기"
          className="flex items-center cursor-pointer gap-1 rounded-xl ml-1 px-3 pr-2 py-1 hover:bg-surface-4 transition text-accent"
        >
          <div className="text-base text-white">{currentModel}</div>
          <svg
            viewBox="0 0 24 24"
            className={[
              "size-6 transition-transform",
              modelSelectorModal.isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
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
          disabled={!hasText || isSending}
          aria-disabled={!hasText || isSending}
          aria-label={isSending ? "전송 중..." : "Send"}
          className={[
            "grid place-items-center rounded-full transition",
            // 크기: 반응형
            "size-9",
            // 여백: 반응형
            "mx-2",
            // 활성/비활성 스타일
            hasText && !isSending
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

      {/* 모델 선택 모달 */}
      <ModelSelectorModal
        isOpen={modelSelectorModal.isOpen}
        onClose={closeModelSelectorModal}
        currentModel={modelSelectorModal.currentModel}
        onModelSelect={handleModelSelect}
        anchorRect={modelSelectorModal.anchorRect as DOMRect | null}
        availableModels={availableModels}
        isLoading={modelsLoading}
        error={null}
      />
    </div>
  );
});

export default ChattingInputContainer;