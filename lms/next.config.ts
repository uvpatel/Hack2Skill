import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default withSentryConfig(
  nextConfig,
  {
    org: "jsmpro",
    project: "jsm_converso",
    silent: !process.env.CI,
    disableLogger: true,
  },
  {
    // 👇 Required for Next 15+
    widenClientFileUpload: true,
    automaticVercelMonitors: true,
  }
);
