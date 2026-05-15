// app/product/[productId]/page.tsx
import { Suspense } from 'react';
import ProductClient from './ProductClient';

// 🟢 Revalidate every 60 seconds
export const revalidate = 60;

// 🟢 Tell Next.js which product IDs exist at build time
export async function generateStaticParams() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${backendUrl}/api/product/list`);
    const data = await res.json();

    if (!data.success) return [];

    return data.products.map((product: any) => ({
      productId: product._id,
    }));
  } catch (error) {
    console.log("⚠️ Backend not reachable during build. Skipping static generation.");
    return []; // Return empty list so the build continues
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = `${backendUrl}/api/product/single`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    console.error(`Failed to fetch product ${productId}. Status: ${res.status}`);
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  const data = await res.json();
  const initialProductData = data.success ? data.product : null;

  if (!initialProductData) {
    return <div className="py-20 text-center uppercase tracking-widest text-xs">Product not found.</div>;
  }

  // 🟢 The Final Tweak: Wrap the Client in Suspense
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-zinc-50/50" />}>
      <ProductClient initialProductData={initialProductData} />
    </Suspense>
  );
}