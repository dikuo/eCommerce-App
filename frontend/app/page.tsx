import Hero from "@/components/Hero";
import LatestCollection from "@/components/LatestCollection";
import BestSeller from "@/components/BestSeller";
import OurPolicy from "@/components/OurPolicy";
import NewsletterBox from "@/components/NewsletterBox";

import { ciMockProducts } from "@/utils/mockData";

export const revalidate = 60;

// 🪐 Smart Cluster Router: Selects internal K8s DNS inside the cluster network
const getBackendUrl = () => {
  const isServer = typeof window === 'undefined';
  const isInsideK8sPod = isServer && process.env.KUBERNETES_SERVICE_HOST;

  return isInsideK8sPod 
    ? "http://backend-service:8080" 
    : process.env.NEXT_PUBLIC_BACKEND_URL;
};

export default async function Page() {
  const backendUrl = getBackendUrl();
  let allProducts = [];

  try {
    if (!backendUrl) throw new Error("Backend URL not defined");

    const res = await fetch(`${backendUrl}/api/product/list`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000) // Prevents hanging connections from blocking builds
    });

    if (!res.ok) throw new Error(`Fetch failed with status code: ${res.status}`);

    const data = await res.json();
    allProducts = data.success ? data.products : [];
    
    console.log(`🏠 Homepage populated successfully with ${allProducts.length} products inside the pod runtime.`);
  } catch (error) {
    console.error("⚠️ Home Page Server Fetch Exception:", error);
    allProducts = process.env.CI ? ciMockProducts : []; // Use mock data only in CI environments, otherwise fallback to empty array
  }

  // Slicing arrays safely from active runtime database values
  const latestProducts = allProducts.slice(0, 10);
  const bestSellers = allProducts.filter((item: any) => item.bestseller).slice(0, 5);

  return (
    <main>
      <Hero />
      <LatestCollection products={latestProducts} />
      <BestSeller products={bestSellers} />
      <OurPolicy />
      <NewsletterBox />
    </main>
  );
}