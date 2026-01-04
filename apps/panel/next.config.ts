import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@repo/utils",
    "@repo/theme",
    "@repo/api",
    "@repo/i18n",
  ],
};

export default nextConfig;
