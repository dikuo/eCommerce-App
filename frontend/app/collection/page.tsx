import { Suspense } from 'react';
import CollectionClient from './CollectionClient';

export const revalidate = 60;

export default async function Page() {
  const backendUrl = "http://backend-service:8080";
  let initialProducts = [];

  try {
    // We add a timeout or check if backendUrl exists to prevent build hangs
    if (!backendUrl) throw new Error("Backend URL not defined");

    const res = await fetch(`${backendUrl}/api/product/list`, {
      next: { revalidate: 60 },
      // 🟢 Add a short cache/timeout hint
      signal: AbortSignal.timeout(5000) 
    });

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    initialProducts = data.success ? data.products : [];
  } catch (error) {
    // 🟢 This is the "Safety Net" for your Docker Build
    console.error("⚠️ Collection Page: Backend unreachable during build. Defaulting to empty list.");
    initialProducts = []; 
  }

  return (
    <Suspense fallback={<div className="py-20 text-center uppercase tracking-widest text-xs">Loading Collection...</div>}>
      <CollectionClient initialProducts={initialProducts} />
    </Suspense>
  );
}