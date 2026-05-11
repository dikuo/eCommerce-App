'use client';

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import ProductItem from "@/components/ProductItem";
import type { Product } from "@shared/types";

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  currentProductId: string; // 🟢 Added to prevent recommending the same item
}

const RelatedProducts = ({ category, subCategory, currentProductId }: RelatedProductsProps) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      // 1. Filter by category 
      // 2. Exclude the current product
      let filtered = products.filter((item) => item._id !== currentProductId);
      
      // 3. Try to match both category AND subCategory first
      let matches = filtered.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );

      // 4. Fallback: If we have fewer than 4 matches, pull from the general category
      if (matches.length < 4) {
        matches = filtered.filter((item) => item.category === category);
      }

      // 5. Limit to 5 products
      setRelated(matches.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="my-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center text-3xl py-8">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
        <p className="text-sm text-zinc-400 mt-2 font-medium tracking-wide">YOU MIGHT ALSO LIKE THESE</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
        {related.map((item) => (
          <ProductItem 
            key={item._id} 
            id={item._id} 
            name={item.name} 
            price={item.price} 
            image={item.image} 
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;