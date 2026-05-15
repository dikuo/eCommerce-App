import Hero from "@/components/Hero";
import LatestCollection from "@/components/LatestCollection";
import BestSeller from "@/components/BestSeller";
import OurPolicy from "@/components/OurPolicy";
import NewsletterBox from "@/components/NewsletterBox";

export const revalidate = 60;

export default async function Page() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  let allProducts = [];

  try {
    // 🟢 Safety check for the Docker build environment
    if (!backendUrl) throw new Error("Backend URL not defined");

    const res = await fetch(`${backendUrl}/api/product/list`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000) // Don't let a hanging connection stall your build
    });

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    allProducts = data.success ? data.products : [];
  } catch (error) {
    // 🟢 Logs locally during build, but won't crash the container creation
    console.error("⚠️ Home Page: Backend unreachable during build. ISR will fetch data at runtime.");
    allProducts = []; 
  }

  // Prepare data (will be empty during build, populated at runtime)
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