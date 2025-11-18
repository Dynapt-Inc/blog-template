import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for blog template consumer
  output: 'standalone',
  transpilePackages: ["@caleblawson/blog-shell"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
