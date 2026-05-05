import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { Product } from '@shared/types';
import { Link } from 'react-router-dom';

const BestSeller: React.FC = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item: Product) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Refined Understated Header */}
      <div className='flex flex-col items-center text-center space-y-3 mb-12'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase'>
          The <span className='text-zinc-400'>Bestsellers</span>
        </h2>
        <p className='max-w-md text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-widest'>
          Most coveted pieces of the season.
        </p>
      </div>

      {/* Premium Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12'>
        {bestSeller.map((item: Product) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-16 flex justify-center">
        <Link
          to="/collection"
          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-950 border-b border-zinc-950 pb-1 hover:text-zinc-400 hover:border-zinc-400 transition-all duration-300 cursor-pointer"
        >
          Explore All
        </Link>
      </div>

    </section>
  );
}

export default BestSeller;