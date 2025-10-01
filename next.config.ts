import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false, // 👈 개발 모드에서 useEffect 2번 호출 방지
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8081",   // 개발용 서버 이미지
            },
            {
                protocol: "https",
                hostname: "cdn.myservice.com", // 운영용 CDN
            },
            {
                protocol: "https",
                hostname: "img.com",           // 지금 응답에서 오는 도메인
            },
        ],
    },
};

export default nextConfig;
