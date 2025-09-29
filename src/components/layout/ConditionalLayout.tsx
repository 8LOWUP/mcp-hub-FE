// components/layout/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SocialLoginCallbackHandler from "@/components/auth/SocialLoginCallbackHandler";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // chat 경로에서는 Header/Footer 숨김
  const hideHeader = pathname.includes("/chat");
  const hideFooter = pathname.includes("/chat");

  return (
    <>
      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <Footer />}
      {/* 소셜 로그인 콜백 처리 */}
      <SocialLoginCallbackHandler />
    </>
  );
}