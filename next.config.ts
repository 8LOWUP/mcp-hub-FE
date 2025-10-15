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
};

export default withNextIntl(nextConfig);
