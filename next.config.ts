import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal server bundle for container deployments
  output: "standalone",
};

export default nextConfig;
