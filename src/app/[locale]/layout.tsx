import "../globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { CurrentWorkspaceProvider } from "@/contexts/CurrentWorkspaceContext";
import ToasterClient from "@/components/common/ToasterClient"; // ✅ 추가

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: ReactNode;
    params: { locale: string }; // ✅ Promise 제거
}) {
    const { locale } = params;
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                <QueryProvider>
                    <AuthProvider>
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
                    </AuthProvider>
                </QueryProvider>
            </NextIntlClientProvider>
        </ThemeProvider>

        {/* ✅ 전역 Toaster (클라이언트 컴포넌트) */}
        <ToasterClient />
        </body>
        </html>
    );
}
