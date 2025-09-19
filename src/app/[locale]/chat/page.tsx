// app/[locale]/chat/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ActiveMCPContainer from "@/features/chat/components/ActiveMCPContainer";
import ChattingWindowContainer from "@/features/chat/components/ChattingWindowContainer";
import HistoryContainer from "@/features/chat/components/HistoryContainer";
import { useTranslations } from "next-intl";

export default function ChatPage() {
  const t = useTranslations("ChatPage");

  // sm ~ md 드로어 상태
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const anyOpen = leftOpen || rightOpen;

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 푸시 거리: CSS 변수로 통일 (sm~md에서만 의미 있음)
  const styleVars = useMemo(
    () =>
      ({
        // 드로어 공통 폭: 85vw, 최대 360px
        ["--drawer-w" as any]: "min(85vw, 360px)",
        // 컨텐츠 푸시 변환
        transform:
          leftOpen
            ? "translateX(var(--drawer-w))"
            : rightOpen
            ? "translateX(calc(-1 * var(--drawer-w)))"
            : "none",
      } as React.CSSProperties),
    [leftOpen, rightOpen]
  );

  return (
    <>
      <main
        className={[
          "pt-20 w-full h-dvh min-h-0 bg-surface-1",
          // 오버레이 뜰 때 배경 스크롤 잠금 (sm~md)
          anyOpen ? "sm:overflow-hidden lg:overflow-visible" : "",
        ].join(" ")}
      >
        {/* 레이아웃 루트 (lg: 3컬럼, sm~md: 중앙 + 오프캔버스) */}
        <div className="relative h-[calc(100dvh-80px)] max-w-screen min-h-0 overflow-x-hidden">
          {/* ============ lg 이상: 좌/우 고정 컬럼 ============ */}
          <div className="hidden lg:grid lg:grid-cols-[280px_minmax(0,1fr)_300px] lg:h-full">
            <aside className="min-h-0 overflow-y-auto border-r border-white/10">
              <HistoryContainer />
            </aside>
            <section className="min-h-0 overflow-y-auto p-4">
              <ChattingWindowContainer />
            </section>
            <aside className="min-h-0 overflow-y-auto border-l border-white/10">
              <ActiveMCPContainer />
            </aside>
          </div>

          {/* ============ sm~md: 푸시 드로어 레이아웃 ============ */}
          <div className="sm:block lg:hidden h-full">
            {/* 좌 드로어 */}
            <div
              role="dialog"
              aria-modal="true"
              aria-hidden={!leftOpen}
              className={[
                "fixed inset-y-0 left-0 z-50 sm:block lg:hidden",
                "w-[var(--drawer-w)] bg-surface-2 border-r border-white/10",
                "shadow-xl transition-transform duration-300 will-change-transform",
                leftOpen ? "translate-x-0" : "translate-x-[-100%]",
              ].join(" ")}
              style={styleVars}
            >
              <div className="h-12 flex items-center justify-between px-3 border-b border-white/10">
                <span className="text-sm font-medium">히스토리</span>
                <button
                  onClick={() => setLeftOpen(false)}
                  className="rounded-md p-2 hover:bg-white/10"
                  aria-label="히스토리 닫기"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100%-48px)] overflow-y-auto">
                <HistoryContainer />
              </div>
            </div>

            {/* 우 드로어 */}
            <div
              role="dialog"
              aria-modal="true"
              aria-hidden={!rightOpen}
              className={[
                "fixed inset-y-0 right-0 z-50 sm:block lg:hidden",
                "w-[var(--drawer-w)] bg-surface-2 border-l border-white/10",
                "shadow-xl transition-transform duration-300 will-change-transform",
                rightOpen ? "translate-x-0" : "translate-x-[100%]",
              ].join(" ")}
              style={styleVars}
            >
              <div className="h-12 flex items-center justify-between px-3 border-b border-white/10">
                <span className="text-sm font-medium">MCP</span>
                <button
                  onClick={() => setRightOpen(false)}
                  className="rounded-md p-2 hover:bg-white/10"
                  aria-label="MCP 닫기"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100%-48px)] overflow-y-auto">
                <ActiveMCPContainer />
              </div>
            </div>

            {/* 컨텐츠 래퍼: 드로어 열리면 푸시 이동 */}
            <div
              className={[
                "relative z-30 h-full min-h-0",
                "transition-transform duration-300 will-change-transform",
              ].join(" ")}
              style={styleVars}
            >
              {/* 상단 토글 버튼들 */}
              <div className="hidden sm:flex items-center justify-between gap-3 px-4 pt-3 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setRightOpen(false);
                    setLeftOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-foreground/10 hover:bg-foreground/15 transition"
                  aria-haspopup="dialog"
                  aria-expanded={leftOpen}
                  aria-controls="history-drawer"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  히스토리
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLeftOpen(false);
                    setRightOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-foreground/10 hover:bg-foreground/15 transition"
                  aria-haspopup="dialog"
                  aria-expanded={rightOpen}
                  aria-controls="mcp-drawer"
                >
                  MCP
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              {/* 중앙 채팅 */}
              <div className="h-[calc(100%-52px)] min-h-0 overflow-y-auto px-4 pb-4">
                <ChattingWindowContainer />
              </div>
            </div>

            {/* 오버레이 (푸시 방식이지만 배경 클릭으로 닫기) */}
            {anyOpen && (
              <button
                type="button"
                onClick={() => {
                  setLeftOpen(false);
                  setRightOpen(false);
                }}
                aria-label="닫기"
                className="fixed inset-0 z-20 sm:block lg:hidden bg-black/30"
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
