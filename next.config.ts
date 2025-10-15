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
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/__api/mcps/images/**",
            },
            {
                protocol: "https",
                hostname: "**",
                pathname: "/__api/mcps/images/**",
            },
        ],
    },
};

export default withNextIntl(nextConfig);
