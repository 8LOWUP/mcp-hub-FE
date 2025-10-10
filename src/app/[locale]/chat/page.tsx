// app/[locale]/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import ActiveMCPContainer from "@/features/chat/components/ActiveMCPContainer";
import ChattingWindowContainer from "@/features/chat/components/ChattingWindowContainer";
import HistoryContainer from "@/features/chat/components/HistoryContainer";
import { useTranslations } from "next-intl";
import { useModelManager } from "@/hooks/chat/useModelManager";

export default function ChatPage() {
  const t = useTranslations("ChatPage");

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const anyOpen = leftOpen || rightOpen;

  // 🔹 모델 매니저를 최상위에서 한 번만 호출
  const { availableModels, selectedModel, isLoading: modelsLoading, selectModel } = useModelManager();

  // ✅ lg 브레이크포인트에 맞춰 open 상태 자동 동기화
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      if (mq.matches) {
        // lg 이상: 기본 열림
        setLeftOpen(true);
        setRightOpen(true);
      } else {
        // lg 미만: 기본 닫힘
        setLeftOpen(false);
        setRightOpen(false);
      }
    };

    // 최초 1회 및 변경 시 동기화
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // ESC + 헤더 토글 이벤트
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    const onToggleLeft = () => {
      setLeftOpen((v) => !v);
      setRightOpen(false);
    };
    const onToggleRight = () => {
      setRightOpen((v) => !v);
      setLeftOpen(false);
    };
    const onCloseDrawers = () => {
      setLeftOpen(false);
      setRightOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("chat:toggle-left", onToggleLeft as EventListener);
    window.addEventListener("chat:toggle-right", onToggleRight as EventListener);
    window.addEventListener("chat:close-drawers", onCloseDrawers as EventListener);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("chat:toggle-left", onToggleLeft as EventListener);
      window.removeEventListener("chat:toggle-right", onToggleRight as EventListener);
      window.removeEventListener("chat:close-drawers", onCloseDrawers as EventListener);
    };
  }, []);

  return (
    <main className={["w-full min-h-0 bg-surface-1", anyOpen ? "sm:overflow-hidden lg:overflow-visible" : ""].join(" ")}>
      <div className="relative h-[calc(100dvh-80px)] max-w-screen min-h-0 overflow-hidden lg:flex">
        {/* 좌 패널 */}
        <aside
          className={[
            "absolute inset-y-0 left-0 z-40 bg-surface-1 overflow-hidden",
            "transition-[width,opacity] duration-300 ease-in-out",
            leftOpen ? "w-[280px] opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none",
            // ✅ lg 에서는 항상 보이도록 보장 (상태 적용 전 첫 렌더 안전장치)
            "lg:relative lg:inset-auto lg:left-auto lg:right-auto lg:opacity-100 lg:pointer-events-auto",
          ].join(" ")}
        >
          <div className="w-[280px] h-full overflow-y-auto">
            <HistoryContainer />
          </div>
        </aside>

        {/* 중앙 */}
        <section
          className={[
            "relative z-30 h-full overflow-y-auto",
            "transition-transform duration-300 ease-in-out",
            leftOpen ? "translate-x-[280px]" : "translate-x-0",
            rightOpen ? "translate-x-[-280px]" : "translate-x-0",
            "lg:flex-1",
            // ✅ lg 에선 밀림 유지 원하면 아래 줄 주석 해제 X (현재 유지됨)
            "lg:translate-x-0", // ← 만약 lg에서 안 밀리게 하려면 이 줄 추가
          ].join(" ")}
        >
          <ChattingWindowContainer 
            availableModels={availableModels}
            selectedModel={selectedModel}
            modelsLoading={modelsLoading}
            selectModel={selectModel}
          />
        </section>

        {/* 우 패널 */}
        <aside
          className={[
            "absolute inset-y-0 right-0 z-40 bg-surface-1 overflow-hidden",
            "transition-[width,opacity] duration-300 ease-in-out",
            rightOpen ? "w-[280px] opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none",
            "lg:relative lg:inset-auto lg:left-auto lg:right-auto lg:opacity-100 lg:pointer-events-auto",
          ].join(" ")}
        >
          <div className="w-[280px] h-full overflow-y-auto">
            <ActiveMCPContainer />
          </div>
        </aside>

        {/* 오버레이 (모바일/태블릿 전용) */}
        {(leftOpen || rightOpen) && (
          <button
            onClick={() => {
              setLeftOpen(false);
              setRightOpen(false);
            }}
            aria-label="닫기"
            className="fixed inset-0 z-30 block lg:hidden bg-black/30"
          />
        )}
      </div>
    </main>
  );
}