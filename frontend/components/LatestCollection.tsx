// components/LatestCollection.tsx
import ProductItem from "@/components/ProductItem";
import type { Product } from "@shared/types";

// 🟢 Accept products as a prop directly
const LatestCollection = ({ products }: { products: Product[] }) => {
  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase">
          Latest <span className="text-zinc-400">Arrivals</span>
        </h2>
        <p className="max-w-md text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-widest">
          The New Season has arrived.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {products.map((item) => (
          <ProductItem 
            key={item._id}
            product={item}    
          /> 
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;