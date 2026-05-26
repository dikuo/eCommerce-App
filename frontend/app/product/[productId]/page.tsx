import { Suspense } from 'react';
import ProductClient from './ProductClient';

export const revalidate = 60;

const getBackendUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.KUBERNETES_SERVICE_HOST
      ? "http://backend-service.default.svc.cluster.local:8080"
      : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080");
  }
  return "";
};

export async function generateStaticParams() {
  try {
    const res = await fetch(`${getBackendUrl()}/api/product/list`, {
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (data.success) {
      return data.products.map((product: any) => ({
        productId: product._id,
      }));
    }
  } catch (error) {
    console.log("⚠️ Backend not reachable during build. Skipping static params.");
  }
  return [];
}

export default async function Page({
  params
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params;

  try {
    const res = await fetch(`${getBackendUrl()}/api/product/single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
      next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

    const data = await res.json();
    const initialProductData = data.success ? data.product : null;

    if (!initialProductData) {
      return <div className="py-20 text-center uppercase tracking-widest text-xs">Product not found.</div>;
    }

    return (
      <Suspense fallback={<div className="h-screen animate-pulse bg-zinc-50/50" />}>
        <ProductClient initialProductData={initialProductData} />
      </Suspense>
    );

  } catch (error) {
    console.error(`🔴 Error fetching product ${productId}:`, error);
    return (
      <div className="py-20 text-center uppercase tracking-widest text-xs text-red-500">
        Product temporarily unavailable.
      </div>
    );
  }
}