'use client';

import Image from 'next/image';
import { useState, useEffect } from "react"; // 🟢 Added useEffect
import { useShop } from "@/context/ShopContext";
import RelatedProducts from "@/components/RelatedProducts";
import type { Product as ProductType } from "@shared/types";
import { Star, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface ExtendedProduct extends ProductType {
  stock?: number;
  stockStatus?: string;
}

const ProductClient = ({ initialProductData }: { initialProductData: ExtendedProduct }) => {
  const { currency, addToCart } = useShop();

  // 🟢 1. Local State for Live Data
  // We initialize with the ISR data so the page isn't empty on load
  const [liveStock, setLiveStock] = useState<number>(initialProductData.stock ?? 0);
  const [liveStatus, setLiveStatus] = useState<string>(initialProductData.stockStatus || "Live Status");
  const [isSyncing, setIsSyncing] = useState(true);

  const [image, setImage] = useState(initialProductData.image[0]);
  const [size, setSize] = useState("");

  // 🟢 2. The Hybrid "Handshake"
  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/product/single`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: initialProductData._id }),
        });

        const data = await res.json();

        if (data.success) {
          setLiveStock(data.product.stock);
          setLiveStatus(data.product.stockStatus);
        }
      } catch (error) {
        console.error("Failed to sync live inventory:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchLiveInventory();
  }, [initialProductData._id]);

  // Derived logic uses the LIVE stock now
  const isOutOfStock = liveStock <= 0;
  const isLowStock = liveStock > 0 && liveStock <= 5;

  return (
    <div className="pt-10 transition-all ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col lg:flex-row">

        {/* -------- Left: Product Images (Remains Same) -------- */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row h-fit lg:sticky lg:top-24">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-start gap-3 sm:w-[15%] w-full no-scrollbar">
            {initialProductData.image.map((item, index) => (
              <div
                key={index}
                className={`relative aspect-square w-[22%] sm:w-full flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${image === item ? "border-black" : "border-transparent bg-zinc-50"}`}
                onClick={() => setImage(item)}
              >
                <Image fill src={item} alt={`thumb-${index}`} className="object-cover" sizes="10vw" />
              </div>
            ))}
          </div>

          <div className="w-full sm:w-[85%] bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100">
            <div className="relative aspect-[4/5] w-full">
              <Image fill src={image} alt="main-product" className="object-cover hover:scale-105 transition-transform duration-700" priority sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
          </div>
        </div>

        {/* -------- Right: Product Info -------- */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg">
          <nav className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/collection?category=${initialProductData.category}`}
              className="hover:text-black transition-colors"
            >
              {initialProductData.category}
            </Link>
            <span>/</span>
            {/* 🟢 Now a clickable link for the subcategory */}
            <Link
              href={`/collection?category=${initialProductData.category}&subCategory=${initialProductData.subCategory}`}
              className="text-zinc-900 font-bold underline-offset-4 transition-all"
            >
              {initialProductData.subCategory}
            </Link>
          </nav>

          <h1 className="font-semibold text-3xl sm:text-4xl text-zinc-900 leading-tight">{initialProductData.name}</h1>

          <div className="flex items-center gap-1.5 mt-4">
            <div className="flex text-zinc-900">
              {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <Star className="w-4 h-4 text-zinc-300" />
            </div>
            <p className="text-sm text-zinc-500 font-medium pl-2">(122 Reviews)</p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-3xl font-bold text-zinc-950">{currency}{initialProductData.price}</p>

            {/* 🟢 Live Stock Badge */}
            <div className={`flex flex-col items-end transition-opacity duration-300 ${isSyncing ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${liveStock} Left` : 'In Stock'}
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 mt-0.5 italic">
                {isSyncing ? "Syncing..." : `Status: ${liveStatus}`}
              </p>
            </div>
          </div>

          <p className="mt-6 text-zinc-600 leading-relaxed text-base">{initialProductData.description}</p>

          <div className={`flex flex-col gap-4 my-10 ${isOutOfStock ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm tracking-wide uppercase">Select Size</p>
              <button className="text-xs text-zinc-400 underline underline-offset-4">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {initialProductData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`min-w-[56px] h-12 flex items-center justify-center rounded-xl border-2 transition-all font-bold text-sm
                    ${item === size ? "border-black bg-black text-white" : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(initialProductData._id, size)}
            disabled={isOutOfStock || !size}
            className={`w-full h-16 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-lg 
              ${isOutOfStock
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                : "bg-black text-white hover:bg-zinc-800 active:scale-[0.98] shadow-black/10"}
            `}
          >
            {isOutOfStock ? "NOT AVAILABLE" : !size ? "SELECT A SIZE" : "ADD TO CART"}
          </button>

          {/* ... (Value Props) ... */}
          <div className="grid grid-cols-1 gap-4 mt-12 py-8 border-t border-zinc-100">
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-700">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
              <p>100% Original Product</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-700">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center"><Truck className="w-5 h-5" /></div>
              <p>Free Delivery on orders over $150</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-700">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center"><RefreshCcw className="w-5 h-5" /></div>
              <p>Easy return and exchange within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* ... (Description & Related Products) ... */}
      <div className="mt-24 border-t border-zinc-100">
        <div className="flex gap-8 -translate-y-[1px]">
          <button className="border-t-2 border-black py-6 font-bold text-sm tracking-widest uppercase">Description</button>
          <button className="py-6 font-bold text-sm text-zinc-400 tracking-widest uppercase hover:text-black transition-colors">Reviews (122)</button>
        </div>
        <div className="max-w-3xl py-10 space-y-6 text-zinc-600 leading-loose">
          <p>{initialProductData.description}</p>
        </div>
      </div>

      <div className="mt-20 pb-20">
        <RelatedProducts category={initialProductData.category} subCategory={initialProductData.subCategory} currentProductId={initialProductData._id} />
      </div>
    </div>
  );
};

export default ProductClient;