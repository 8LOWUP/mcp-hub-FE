import "../globals.css"; // ★ 전역 스타일 추가
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // 메시지 불러오기
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                {/*  여기서 children을 공통 래퍼로 감싸줌 (페이지 공통 래퍼)*/}
                <div className="min-w-[375px] bg-background text-foreground">
                    {children}
                </div>

                {/* 포탈 위치 지정 */}
                <div id="portal-root" />
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
