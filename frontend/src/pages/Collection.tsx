import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { ShopContext } from "../context/ShopContext.tsx";
import { assets } from "../assets/assets";
import Title from "../components/Title.tsx";
import ProductItem from "../components/ProductItem.tsx";
import type { Product } from "@shared/types";

type SortType = "relavant" | "low-high" | "high-low";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>("relavant");

  const toggleCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleSubCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    const fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>
        <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} alt="" />
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Men" onChange={toggleCategory} /> Men
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Women" onChange={toggleCategory} /> Women
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Kids" onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Topwear" onChange={toggleSubCategory} /> Topwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Bottomwear" onChange={toggleSubCategory} /> Bottomwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Winterwear" onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select onChange={(e) => setSortType(e.target.value as SortType)} className="border-2 border-gray-300 text-sm px-2">
            <option value="relavant">Sort by: Relavant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
