import type { NextConfig } from "next";
import path from "path";

const isInsideK8s = typeof process !== 'undefined' && !!process.env.KUBERNETES_SERVICE_HOST;

// 🟢 Use the K8s-injected env vars if they exist, otherwise fallback to local/compose
const BACKEND_INTERNAL_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
  || "http://backend-service.default.svc.cluster.local:8080";

const INVENTORY_INTERNAL_URL = process.env.INVENTORY_INTERNAL_URL 
  || "http://inventory-service.default.svc.cluster.local:8080";

const nextConfig: NextConfig = {
  /* 1. The Reverse Proxy Rules */
  /* 1. The Reverse Proxy Rules */
  async rewrites() {
    return {
      // 🟢 CRITICAL: Force Next.js to route these before looking for physical pages
      beforeFiles: [
        {
          /**
           * 🟢 Go Inventory Microservice Proxy
           * Catches frontend live stock checks and proxies them directly to the Go engine.
           */
          source: '/api/inventory/:path*',
          destination: `${INVENTORY_INTERNAL_URL}/api/inventory/:path*`,
        },
        {
          /**
           * 🟢 Unified Core API Rewrite Proxy
           */
          source: '/api/:path*',
          destination: `${BACKEND_INTERNAL_URL}/api/:path*`,
        },
        {
          /**
           * 🟢 Image Optimization Rewrite Bridge
           */
          source: '/backend-assets/:path*',
          destination: `${BACKEND_INTERNAL_URL}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  /* 2. Shared Folder Support */
  transpilePackages: ["../shared"],

  /* 3. Docker/Kubernetes Optimization */
  // outputFileTracingRoot: path.join(__dirname, "../../"),
  // output: 'standalone',

  /* 4. Image Configuration */
  images: {
    unoptimized: true, // 🟢 Disable Next.js's built-in image optimization to avoid pod resource strain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // Production asset engine
        pathname: '/**', // Allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // CI pipeline test images
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