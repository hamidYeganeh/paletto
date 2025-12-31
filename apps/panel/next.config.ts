import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils", "@repo/theme", "@repo/api"],
};

export default nextConfig;
