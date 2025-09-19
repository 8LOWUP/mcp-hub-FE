// src/app/[locale]/layout.tsx
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";
import Header from "@/components/layout/Header"; // ✅ 전역 헤더
import Footer from "@/components/layout/Footer";

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                {/* 페이지 공통 래퍼 */}
                <div className="min-w-[375px] bg-background text-foreground min-h-screen">
                    {/* ✅ 전역 헤더 */}
                    <Header />

                    {/* ✅ 헤더 높이만큼 상단 패딩 (Header가 sticky/h-20일 때) */}
                    <main>
                        {children}
                    </main>
                    {/* 공용 푸터*/}
                    <Footer/>
                </div>

                {/* 포탈 루트 */}
                <div id="portal-root" />
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
