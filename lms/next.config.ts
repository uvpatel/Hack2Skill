import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "jsmpro",
  project: "jsm_converso",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
