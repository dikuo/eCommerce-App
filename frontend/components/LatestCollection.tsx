import { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import ProductItem from "@/components/ProductItem";
import type { Product } from "@shared/types";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Refined Understated Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase">
          Latest <span className="text-zinc-400">Arrivals</span>
        </h2>
        <p className="max-w-md text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-widest">
          The New Season has arrived.
        </p>
      </div>

      {/* Premium Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {latestProducts.map((item) => (
          <ProductItem 
            key={item._id} 
            id={item._id} 
            image={item.image} 
            name={item.name} 
            price={item.price} 
          />
        ))}
      </div>
      
    </section>
  );
};

export default LatestCollection;