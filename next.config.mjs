// /next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ['img.com'],
    // 또는 더 안전한 방법으로 remotePatterns 사용
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'img.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
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
