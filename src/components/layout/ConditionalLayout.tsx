// components/layout/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SocialLoginCallbackHandler from "@/components/auth/SocialLoginCallbackHandler";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 특정 경로들에서는 Header/Footer 숨김
  const hiddenSegments = ["chat", "auth"];
  const hideHeader = hiddenSegments.some(seg => pathname.includes(seg));
  const hideFooter = hiddenSegments.some(seg => pathname.includes(seg));

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