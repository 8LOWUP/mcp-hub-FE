// /next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
  },

  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    const raw = process.env.NEXT_PUBLIC_API_IMAGE_URL || "http://localhost:8080";
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
