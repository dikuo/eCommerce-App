'use client';

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShopContext } from "@/context/ShopContext";
import { Plus } from "lucide-react";

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItem = ({ id, image, name, price }: ProductItemProps) => {
  const { currency, setSelectedProduct, products } = useContext(ShopContext);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = products.find(item => item._id === id);
    if (productData) {
      setSelectedProduct(productData);
    }
  };

  return (
    <Link href={`/product/${id}`} className="group flex flex-col gap-3 sm:gap-4">
      
      {/* Image Wrapper */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100 aspect-[4/5] relative border border-zinc-100">
        <Image 
          src={image[0]} 
          alt={name} 
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Quick View Button - Hidden on mobile, visible on hover for desktop */}
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

      {/* Product Details - Center Aligned */}
      <div className="flex flex-col items-center text-center px-1">
        {/* Name: Forces 2 lines of space so the price always sits in the same spot */}
        <h3 className="text-[13px] sm:text-sm font-medium text-zinc-800 leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
          {name}
        </h3>
        
        {/* Price: Deep black for high contrast */}
        <p className="text-sm sm:text-base font-bold text-black mt-1">
          {currency}{price.toLocaleString()}
        </p>
      </div>
      
    </Link>
  );
};

export default ProductItem;