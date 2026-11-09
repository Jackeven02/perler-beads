import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
});

const pagesBasePath = process.env.PAGES_BASE_PATH || "";

// GitHub Pages 需要纯静态产物；WorkBuddy / 本地 Node 服务仍走标准 Next.js 构建。
// 用是否注入 PAGES_BASE_PATH 区分两种部署目标，避免 output:export 与 next start 冲突。
const nextConfig: NextConfig = {
  ...(pagesBasePath
    ? { output: "export" as const, basePath: pagesBasePath, trailingSlash: true }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
