// app/collection/page.tsx
import { Suspense } from 'react';
import CollectionClient from './CollectionClient';

// 🟢 This line enables ISR: Revalidate the data every 60 seconds
export const revalidate = 60;

export default async function Page() {
  // 1. Fetch products directly on the server
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${backendUrl}/api/product/list`, {
    next: { revalidate: 60 } // Double-check ISR logic
  });
  
  const data = await res.json();
  const initialProducts = data.success ? data.products : [];

  return (
    <Suspense fallback={<div className="py-20 text-center uppercase tracking-widest text-xs">Loading Collection...</div>}>
      {/* 2. Pass the server-fetched data to your Client Component */}
      <CollectionClient initialProducts={initialProducts} />
    </Suspense>
  );
}