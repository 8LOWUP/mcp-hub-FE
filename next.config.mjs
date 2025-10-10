// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // ✅ dev 프록시: /__api → BE 로 전달
  async rewrites() {
    if (process.env.NODE_ENV === "production") return []; // prod는 프록시 불필요

    // 백엔드 주소: .env.local 의 NEXT_PUBLIC_API_URL 우선, 없으면 기본값
    const target = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    return [
      {
        source: "/__api/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
