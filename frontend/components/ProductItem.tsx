'use client';

import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { Plus } from "lucide-react";
import type { Product } from "@shared/types";

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { currency, setSelectedProduct } = useShop();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
  };

  /**
   * 🪐 URL Parser: Converts direct backend links into the virtual proxy path
   * so the Next.js optimization engine can resolve them inside the cluster network.
   */
  const getOptimizedSrc = (rawSrc: string) => {
    if (!rawSrc) return '/assets/placeholder.png';

    // If it's an absolute URL pointing to your local development backend port
    if (rawSrc.includes('localhost:8080')) {
      return rawSrc.replace('http://localhost:8080', '/backend-assets');
    }

    // If it's an external image host provider like Cloudinary, return it untouched
    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://')) {
      return rawSrc;
    }

    // Fallback for standard relative database upload schema records
    return `/backend-assets${rawSrc.startsWith('/') ? '' : '/'}${rawSrc}`;
  };

  return (
    <Link
      href={`/product/${product._id}`}
      prefetch={false} // 🟢 CRITICAL: Halts heavy background page prefetching to save pod resources
      className="group flex flex-col gap-3 sm:gap-4"
    >

      {/* Image Wrapper */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100 aspect-[4/5] relative border border-zinc-100">
        <Image
          src={product.image[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          // 🟢 If the image lives on Cloudinary, bypass the pod's broken network pathway
          unoptimized={product.image[0]?.includes('cloudinary.com')}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-end p-2 sm:p-4">
          <button
            onClick={handleQuickView}
            className="hidden sm:flex bg-white/90 backdrop-blur-sm w-full py-2.5 rounded-xl items-center justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-black">Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-center text-center px-1">
        <h3 className="text-[13px] sm:text-sm font-medium text-zinc-800 leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
          {product.name}
        </h3>

        <p className="text-sm sm:text-base font-bold text-black mt-1">
          {currency}{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;