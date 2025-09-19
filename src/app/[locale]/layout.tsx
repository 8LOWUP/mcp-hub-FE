import "../globals.css"; // ★ 전역 스타일 추가
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

  // 메시지 불러오기
  const messages = await getMessages();

  return (
      <html lang={locale} className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
              {/* 공용 헤어*/}
              <Header/>
              <main className={"flex flex-col min-h-screen"}>
              { /* 페이지 컨텐츠 */ }
                  {children}
              </main>
              {/* 공용 푸터*/}
              <Footer/>

            {/* 포탈 위치 지정 */}
            <div id="portal-root" ></div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
      </html>
  );
}
