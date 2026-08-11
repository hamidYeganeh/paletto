import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
