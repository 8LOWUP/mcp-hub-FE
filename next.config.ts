import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

/** @type {NextConfig} */
const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/__api/:path*",
                destination: "http://61.109.236.22/:path*",
            },
        ];
    },
    // 다른 옵션들 필요하면 여기 추가 (images, experimental 등)
};

export default withNextIntl(nextConfig);
