"use client";

import Hero from "@/components/Hero";
import LatestCollection from "@/components/LatestCollection";
import BestSeller from "@/components/BestSeller";
import OurPolicy from "@/components/OurPolicy";
import NewsletterBox from "@/components/NewsletterBox";

export default function Page() {
  return (
    <main>
        <div>
          <Hero />
          <LatestCollection />
          <BestSeller />
          <OurPolicy />
          <NewsletterBox />
        </div>
    </main>
  );
}