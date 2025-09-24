// components/layout/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

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
    </>
  );
}