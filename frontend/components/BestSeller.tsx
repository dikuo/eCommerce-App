// components/BestSeller.tsx
import React from 'react';
import ProductItem from '@/components/ProductItem';
import { Product } from '@shared/types';
import Link from 'next/link';

// 🟢 Accept pre-filtered products as a prop
const BestSeller = ({ products }: { products: Product[] }) => {
  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className='flex flex-col items-center text-center space-y-3 mb-12'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase'>
          The <span className='text-zinc-400'>Bestsellers</span>
        </h2>
        <p className='max-w-md text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-widest'>
          Most coveted pieces of the season.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12'>
        {products.map((item: Product) => (
          <ProductItem
            key={item._id}
            product={item}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/collection"
          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-950 border-b border-zinc-950 pb-1 hover:text-zinc-400 hover:border-zinc-400 transition-all duration-300 cursor-pointer"
        >
          Explore All
        </Link>
      </div>
    </section>
  );
}

export default BestSeller;