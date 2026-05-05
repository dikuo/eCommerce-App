import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'; 

import ShopContextProvider from "@/context/ShopContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cara",
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
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <ToastContainer />
            <Navbar />
            <SearchBar />
            
            {/* 🟢 Next.js automatically injects the current page here */}
            <main>{children}</main>
            
            <Footer />
          </div>
        </ShopContextProvider>
      </body>
    </html>
  );
}