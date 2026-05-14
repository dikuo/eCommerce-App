// app/page.tsx
import Hero from "@/components/Hero";
import LatestCollection from "@/components/LatestCollection";
import BestSeller from "@/components/BestSeller";
import OurPolicy from "@/components/OurPolicy";
import NewsletterBox from "@/components/NewsletterBox";

// 🟢 Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Page() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 1. Fetch data on the server
  const res = await fetch(`${backendUrl}/api/product/list`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  const allProducts = data.success ? data.products : [];

  // 2. Prepare the data for specific sections
  const latestProducts = allProducts.slice(0, 10);
  const bestSellers = allProducts.filter((item: any) => item.bestseller).slice(0, 5);

  return (
    <main>
      <Hero />
      {/* 3. Pass the pre-filtered data down as props */}
      <LatestCollection products={latestProducts} />
      <BestSeller products={bestSellers} />
      <OurPolicy />
      <NewsletterBox />
    </main>
  );
}