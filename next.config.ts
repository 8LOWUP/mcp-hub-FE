import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig : NextConfig = {
  reactStrictMode: false,

  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
    // 간단히 domains 사용
    domains: ["img.com", "k.kakaocdn.net"], // ✅ 카카오 CDN 추가
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/mcps/**',
      },
      {
        protocol: 'https',
        hostname: '61.109.236.22',
        pathname: '/mcps/**',
      },
    ],
  },

  experimental: {
    proxyTimeout: 600000
  },

  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const target = raw.replace(/\/+$/, "");

    return [
      {
        source: "/__api/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
