import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.tsx";
import Title from "./Title.tsx";
import ProductItem from "./ProductItem.tsx";
import type { Product } from "@shared/types";

interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const productsCopy = products.filter((item) => item.category === category && item.subCategory === subCategory);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
