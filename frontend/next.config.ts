import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* 1. The Reverse Proxy (Strangler Fig Pattern) */
  async rewrites() {
    return [
      {
        /**
         * This sends any route that doesn't exist in Next.js 
         * to your legacy Vite/React app on port 3001.
         */
        source: "/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },

  /* 2. Shared Folder Support */
  // Ensures Next.js can compile code if you add logic/constants to ../shared later
  transpilePackages: ["../shared"],

  /* 3. Docker/Kubernetes Optimization */
  // Tells the build process to look at the monorepo root for dependencies

  // outputFileTracingRoot: path.join(__dirname, "../../"),
  
  // Recommended for Docker: Creates a tiny, standalone production build
  // output: 'standalone', 
};

export default nextConfig;