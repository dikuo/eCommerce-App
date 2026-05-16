import type { NextConfig } from "next";
import path from "path";

// 🪐 Smart Cluster Router: Check if running inside a containerized Kubernetes pod
const isInsideK8s = typeof process !== 'undefined' && !!process.env.KUBERNETES_SERVICE_HOST;

const BACKEND_INTERNAL_URL = isInsideK8s 
  ? 'http://backend-service:8080' 
  : 'http://localhost:8080';

const nextConfig: NextConfig = {
  /* 1. The Reverse Proxy Rules */
  async rewrites() {
    return [
      {
        /**
         * 🟢 Image Optimization Rewrite Bridge
         * Intercepts relative image assets paths on the client side and 
         * safely proxies them internally via K8s DNS or local loopback.
         */
        source: '/backend-assets/:path*',
        destination: `${BACKEND_INTERNAL_URL}/:path*`,
      },
      /* // (Legacy Vite/React fallback rule - Keep below specific asset paths)
      {
        source: "/:path*",
        destination: "http://localhost:3001/:path*",
      },
      */
    ];
  },

  /* 2. Shared Folder Support */
  transpilePackages: ["../shared"],

  /* 3. Docker/Kubernetes Optimization */
  // outputFileTracingRoot: path.join(__dirname, "../../"),
  // output: 'standalone',

  /* 4. Image Configuration */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Allow optimization of assets fetched from local development tunnel
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        // Allow optimization of assets fetched via internal cluster DNS
        protocol: 'http',
        hostname: 'backend-service',
        port: '8080',
      },
    ],
  },
};

export default nextConfig;