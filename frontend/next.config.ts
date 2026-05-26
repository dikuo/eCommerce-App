import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL;

// Use Vercel public URLs when on Vercel, k8s internal DNS when in cluster
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
  || (isVercel 
    ? 'https://carastyle-backend.vercel.app'
    : 'http://backend-service.default.svc.cluster.local:8080');

const isK8s = !!process.env.KUBERNETES_SERVICE_HOST;

const INVENTORY_URL = isVercel || !isK8s
  ? 'https://carastyle-backend.vercel.app'
  : (process.env.INVENTORY_INTERNAL_URL 
    || 'http://inventory-service.default.svc.cluster.local:8080');

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/inventory/:path*',
          destination: `${INVENTORY_URL}/api/inventory/:path*`,
        },
        {
          source: '/api/:path*',
          destination: `${BACKEND_URL}/api/:path*`,
        },
        {
          source: '/backend-assets/:path*',
          destination: `${BACKEND_URL}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  transpilePackages: ["../shared"],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'http',
        hostname: 'backend-service',
        port: '8080',
      },
    ],
  },
};

export default nextConfig;