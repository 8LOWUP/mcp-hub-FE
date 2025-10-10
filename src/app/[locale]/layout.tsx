// src/app/[locale]/layout.tsx
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { CurrentWorkspaceProvider } from "@/contexts/CurrentWorkspaceContext";

export default async function RootLayout(
    { children, params,}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col"> {/* ✅ 전체 높이 책임 */}
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                {/* ✅ TanStack Query Provider */}
                <QueryProvider>
                    {/* ✅ 세션 컨텍스트로 감싸서 Header 등에서 useSession() 사용 가능 */}
                    <AuthProvider>
                      {/* ✅ 현재 워크스페이스 상태 관리 */}
                      <CurrentWorkspaceProvider>
                        <ConditionalLayout>
                        <main className="flex-1 min-h-0 w-full h-full flex flex-col"> {/* ✅ 남은 공간 채움 */}
                            <div className="min-w-[375px] bg-background text-foreground min-h-full">
                                {children}
                            </div>
                        </main>
                        {/* ✅ 모달 포털 루트 (BaseModal이 여기로 포털 렌더링) */}
                        <div id="portal-root" />
                        </ConditionalLayout>
                      </CurrentWorkspaceProvider>
                    </AuthProvider>
                </QueryProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
