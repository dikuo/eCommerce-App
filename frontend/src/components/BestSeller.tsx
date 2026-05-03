import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Product } from '@shared/types';

const BestSeller: React.FC = () => {
  // 2. Tell the context what kind of data to expect
  const { products } = useContext(ShopContext);
  
  // 3. Explicitly type the state as an array of Products
  const [bestSeller, setBestSeller] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item: Product) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'> 
          Check out our most popular products this week!
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item: Product) => (
          <ProductItem 
            key={item._id} // Using _id is better than index for keys
            id={item._id} 
            name={item.name} 
            image={item.image} 
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}

export default BestSeller;