import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal server bundle for container deployments
  output: "standalone",
  transpilePackages: ['@caleblawson/blog-shell'],
  webpack: (config) => {
    // Exclude dist folder from webpack resolution to prevent importing bundled package files
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      "src",
    ];
    return config;
  },
};

export default nextConfig;
