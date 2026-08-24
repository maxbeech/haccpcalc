import type { NextConfig } from "next";

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

export default nextConfig;
