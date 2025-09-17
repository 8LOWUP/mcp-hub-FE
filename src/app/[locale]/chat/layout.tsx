// app/[locale]/chat/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";

// (선택) 이 라우트 전용 메타데이터
export const metadata = {
    title: "Chat | MCP HUB",
    description: "MCP를 위한 LLM 채팅 페이지",
};

// (선택) 정적 빌드 시 사용할 로케일 목록
// 프로젝트에 맞게 수정/삭제하세요.
export function generateStaticParams() {
    return [{ locale: "ko" }, { locale: "en" }];
}

export default async function ChatLayout({
                                             children,
                                             params,
                                         }: {
    children: ReactNode;
    params: { locale: string };
}) {
    const { locale } = params;

    // 해당 로케일 번들 로드
    const messages = await getMessages({ locale });

    return (
        // ★ 서브 레이아웃에는 <html>/<body> 사용 금지 (루트 레이아웃 책임)
        <>
            {/* 이 라우트 전용 포탈 루트 (모달/토스트 등) */}
            <div id="chat-portal-root" />

            {/* 페이지 공통 래퍼 */}
            <div className="min-h-dvh bg-background text-foreground">
                {children}
            </div>
        </>

    );
}