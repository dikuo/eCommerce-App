import { useContext } from "react";
import Link from "next/link";
import { ShopContext } from "@/context/ShopContext";

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItem = ({ id, image, name, price }: ProductItemProps) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link href={`/product/${id}`} className="group flex flex-col gap-4">
      
      {/* Image Container with Uniform Aspect Ratio & Zoom Effect */}
      <div className="overflow-hidden rounded-2xl bg-zinc-100 aspect-[4/5] relative">
        <img 
          src={image[0]} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Subtle dark overlay that appears on hover to make it feel premium */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none"></div>
      </div>

      {/* Product Details (Minimalist Typography) */}
      <div className="space-y-1 px-1">
        <h3 className="text-sm sm:text-base font-medium text-zinc-900 truncate">
          {name}
        </h3>
        <p className="text-sm font-semibold text-zinc-500">
          {currency}{price}
        </p>
      </div>
      
    </Link>
  );
};

export default ProductItem;