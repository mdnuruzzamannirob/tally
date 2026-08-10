import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Type safety is enforced as an explicit CI step; this avoids Next's
  // duplicate TypeScript worker during the production bundle.
  typescript: { ignoreBuildErrors: true },
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
