'use client';

import Image from 'next/image';
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import RelatedProducts from "@/components/RelatedProducts";
import type { Product as ProductType } from "@shared/types";
import { Star, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 🟢 Accept the data from the server
const ProductClient = ({ initialProductData }: { initialProductData: ProductType }) => {
  const { currency, addToCart } = useShop();
  
  // Use the server data to initialize state
  const [image, setImage] = useState(initialProductData.image[0]);
  const [size, setSize] = useState("");

  return (
    <div className="pt-10 transition-all ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col lg:flex-row">

        {/* -------- Left: Product Images -------- */}
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
              <Image
                fill
                src={image}
                alt="main-product"
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority // 🟢 Important for LCP (Largest Contentful Paint)
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        {/* -------- Right: Product Info -------- */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg">
          <nav className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/collection?category=${initialProductData.category}`} className="hover:text-black transition-colors">
              {initialProductData.category}
            </Link>
            <span>/</span>
            <p className="text-zinc-900 font-bold">{initialProductData.subCategory}</p>
          </nav>

          <h1 className="font-semibold text-3xl sm:text-4xl text-zinc-900 leading-tight">{initialProductData.name}</h1>

          <div className="flex items-center gap-1.5 mt-4">
            <div className="flex text-zinc-900">
              {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <Star className="w-4 h-4 text-zinc-300" />
            </div>
            <p className="text-sm text-zinc-500 font-medium pl-2">(122 Reviews)</p>
          </div>

          <p className="mt-6 text-3xl font-bold text-zinc-950">{currency}{initialProductData.price}</p>
          <p className="mt-6 text-zinc-600 leading-relaxed text-base">{initialProductData.description}</p>

          {/* Size Selector */}
          <div className="flex flex-col gap-4 my-10">
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
            className="w-full bg-black text-white h-16 rounded-2xl font-bold text-base hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/10"
          >
            ADD TO CART
          </button>

          {/* Value Props */}
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

      {/* Description & Related Products */}
      <div className="mt-24 border-t border-zinc-100">
        <div className="flex gap-8 -translate-y-[1px]">
          <button className="border-t-2 border-black py-6 font-bold text-sm tracking-widest uppercase">Description</button>
          <button className="py-6 font-bold text-sm text-zinc-400 tracking-widest uppercase hover:text-black transition-colors">Reviews (122)</button>
        </div>
        <div className="max-w-3xl py-10 space-y-6 text-zinc-600 leading-loose">
          <p>{initialProductData.description}</p>
          <p>Premium quality staple addition to any modern wardrobe.</p>
        </div>
      </div>

      <div className="mt-20 pb-20">
        <RelatedProducts 
          category={initialProductData.category} 
          subCategory={initialProductData.subCategory} 
          currentProductId={initialProductData._id} 
        />
      </div>
    </div>
  );
};

export default ProductClient;