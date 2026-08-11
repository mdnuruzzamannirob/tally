import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  // Type safety is enforced as an explicit CI step; this avoids Next's
  // duplicate TypeScript worker during the production bundle.
  typescript: { ignoreBuildErrors: true },
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
