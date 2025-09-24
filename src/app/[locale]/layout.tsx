import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/contexts/theme-provider";
import Header from "@/components/layout/Header";
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
        <body className="min-h-screen flex flex-col">       {/* ✅ 전체 높이 책임 */}
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                <Header />
                <main className="w-full h-full flex-1 flex flex-col min-w-[375px] bg-background text-foreground min-h-full"> {/* ✅ 남은 공간 채움 */}
                    {/* ✅ 페이지 공통 래퍼 */}
                    {children}
                </main>
                <Footer />
                <div id="portal-root" />
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}