import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_CDN_URL || "", // 기본값으로 빈 문자열을 제공하거나 에러 처리를 할 수 있습니다.
        port: "",
        pathname: "/**", // 필요에 따라 경로를 더 구체적으로 지정할 수 있습니다.
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND}/:path*`,
      },
    ];
  },
};

export default nextConfig;
