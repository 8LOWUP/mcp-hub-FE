import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ThemeProvider } from '@/contexts/theme-provider';
 
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
 
  // 클라이언트에게 모든 메시지를 제공합니다.
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            {/* 포탈 위치 지정 */}
            <div id="portal-root" ></div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}