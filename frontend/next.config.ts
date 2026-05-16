import type { NextConfig } from "next";
import path from "path";

// 🪐 Smart Cluster Router: Check if running inside a containerized Kubernetes pod
const isInsideK8s = typeof process !== 'undefined' && !!process.env.KUBERNETES_SERVICE_HOST;

const BACKEND_INTERNAL_URL = isInsideK8s 
  ? 'http://backend-service:8080' 
  : 'http://localhost:8080';

  // 🟢 Go Inventory Microservice Routing Target
// In K8s, it uses port 8080 over its own service line. Locally, assume port 8081 to avoid conflict.
const INVENTORY_INTERNAL_URL = isInsideK8s 
  ? 'http://inventory-service:8080' 
  : 'http://localhost:8081';

const nextConfig: NextConfig = {
  /* 1. The Reverse Proxy Rules */
  async rewrites() {
    return [
      {
        /**
         * 🟢 Go Inventory Microservice Proxy
         * Catches frontend live stock checks and proxies them directly to the Go engine.
         * CRITICAL: This MUST sit above the general /api/:path* catch-all.
         */
        source: '/api/inventory/:id',
        destination: `${INVENTORY_INTERNAL_URL}/api/inventory/:id`,
      },
      {
        /**
         * 🟢 Unified Core API Rewrite Proxy
         * Catches browser-side relative fetches (/api/...) and pipes them 
         * directly over internal network lines to your backend microservice.
         */
        source: '/api/:path*',
        destination: `${BACKEND_INTERNAL_URL}/api/:path*`,
      },
      {
        /**
         * 🟢 Image Optimization Rewrite Bridge
         * Intercepts relative image assets paths on the client side and 
         * safely proxies them internally via K8s DNS or local loopback.
         */
        source: '/backend-assets/:path*',
        destination: `${BACKEND_INTERNAL_URL}/:path*`,
      },
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
        hostname: 'res.cloudinary.com',  // Production asset engine
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