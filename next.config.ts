import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { SENTRY_ORG, SENTRY_PROJECT } from "./lib/sentry-options";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/guides/haccp-plan-for-restaurants",
        destination: "/guides/haccp-plan-template",
        permanent: true,
      },
    ];
  },
};

/**
 * Sentry wraps the build to upload source maps (skipped without an auth token,
 * so a plain `npm run build` still works). The tunnel route sends browser
 * events via our own domain; `true` randomises the path per build because a
 * fixed "/monitoring" is on ad-blocker lists.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || SENTRY_ORG,
  project: process.env.SENTRY_PROJECT || SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
