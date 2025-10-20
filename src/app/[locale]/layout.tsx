import "../globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";
// import AuthProvider from "@/providers/AuthProvider"; // NextAuth 제거됨
import QueryProvider from "@/providers/QueryProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { CurrentWorkspaceProvider } from "@/contexts/CurrentWorkspaceContext";
import ToasterClient from "@/components/common/ToasterClient"; // ✅ 추가
import ErrorModalProvider from "@/components/common/ErrorModalProvider";
import GlobalLoginModal from "@/components/auth/GlobalLoginModal";
import AuthRequiredHandler from "@/components/auth/AuthRequiredHandler";

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                <QueryProvider>
                    <CurrentWorkspaceProvider>
                        <ConditionalLayout>
                            <main className="flex-1 min-h-0 w-full h-full flex flex-col">
                                <div className="min-w-[375px] bg-background text-foreground min-h-full">
                                    {children}
                                </div>
                            </main>

                            {/* 모달 포털 */}
                            <div id="portal-root" />
                        </ConditionalLayout>
                    </CurrentWorkspaceProvider>
                    {/* ✅ 전역 에러 모달 (쿼리 컨텍스트 내부로 이동) */}
                    <ErrorModalProvider />
                    
                    {/* ✅ 전역 LoginModal (NextIntl 컨텍스트 내부로 이동) */}
                    <GlobalLoginModal />
                    
                    {/* ✅ 전역 AuthRequiredHandler (모든 페이지에서 작동) */}
                    <AuthRequiredHandler />
                </QueryProvider>
            </NextIntlClientProvider>
        </ThemeProvider>

        {/* ✅ 전역 Toaster (클라이언트 컴포넌트) */}
        <ToasterClient />
        
        </body>
        </html>
    );
}
