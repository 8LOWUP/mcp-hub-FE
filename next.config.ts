import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.js",
  },

  experimental: { proxyTimeout: 600000 },

  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const target = raw.replace(/\/+$/, "");

    return [
      { source: "/__api/:path*", destination: `${target}/:path*` },
      { source: "/__img/:path*", destination: `${target}/:path*` }, // ✅ dev용 이미지 프록시
    ];
  },
};

export default withNextIntl(nextConfig);
