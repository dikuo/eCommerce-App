import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 🟢 Providers & Context
import ShopContextProvider from "@/context/ShopContext";

// 🟢 Global Components
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/QuickViewModal";

// 🟢 Premium Notifications (Replacing Toastify)
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaraStyle",
  description: "AI-Integrated e-commerce infrastructure built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ShopContextProvider>
          {/* Main Layout Wrapper */}
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex flex-col min-h-screen">
            <Navbar />
            <SearchBar />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
          </div>

          {/* Global UI Elements (Modals & Notifications) */}
          <QuickViewModal />
          
          {/* 🟢 Sonner Toaster: Positioned bottom-right to avoid blocking the Navbar */}
          <Toaster position="bottom-right" closeButton />
        </ShopContextProvider>
      </body>
    </html>
  );
}