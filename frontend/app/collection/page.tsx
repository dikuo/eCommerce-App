'use client';

import { Suspense } from 'react';
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import ProductItem from "@/components/ProductItem";
import type { Product } from "@shared/types";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

type SortType = "relavant" | "low-high" | "high-low";

const Collection = () => {
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category");
  const subCategoryFromURL = searchParams.get("subCategory");

  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>("relavant");

  // 1. Sync URL Parameters to State
  useEffect(() => {
    if (categoryFromURL) {
      setCategory([categoryFromURL]);
    } else {
      setCategory([]);
    }

    if (subCategoryFromURL) {
      setSubCategory([subCategoryFromURL]);
    } else {
      setSubCategory([]);
    }

  }, [categoryFromURL, subCategoryFromURL]);

  const toggleCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // 2. Optimized Filter Logic
  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    if (sortType === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-12 border-t border-gray-100 items-start">

      {/* --- Filter Sidebar --- */}
      {/* 'sticky' works here because the parent has 'items-start' */}
      <aside className="sticky top-28 min-w-64 w-full sm:w-64 h-fit">

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="group mb-5 text-xl font-medium flex items-center gap-3 cursor-pointer sm:cursor-default"
        >
          <SlidersHorizontal className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />
          FILTERS
          <ChevronRight
            className={`w-4 h-4 text-zinc-400 transition-transform duration-300 sm:hidden ${showFilter ? "rotate-90" : ""
              }`}
          />
        </button>

        {/* Filters Container */}
        <div className={`space-y-6 ${showFilter ? "block" : "hidden"} sm:block animate-in fade-in slide-in-from-left-2 duration-500`}>

          {/* Category Filter */}
          <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100">
            <p className="mb-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">Categories</p>
            <div className="flex flex-col gap-3 text-sm font-medium text-zinc-600">
              {["Men", "Women", "Kids"].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
                  <input
                    className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer transition-all"
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100">
            <p className="mb-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">Type</p>
            <div className="flex flex-col gap-3 text-sm font-medium text-zinc-600">
              {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                <label key={sub} className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
                  <input
                    className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer transition-all"
                    type="checkbox"
                    value={sub}
                    onChange={toggleSubCategory}
                    checked={subCategory.includes(sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Product Grid --- */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <span className="text-zinc-400 text-sm font-medium bg-zinc-50 px-2 py-0.5 rounded-md mt-1">
              {filterProducts.length}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group min-w-[200px]">
            <select
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="appearance-none w-full border border-zinc-200 text-sm py-3 px-4 rounded-xl bg-white focus:ring-2 focus:ring-black/5 outline-none cursor-pointer font-medium hover:border-zinc-300 transition-all"
            >
              <option value="relavant">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Product Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 px-2 sm:px-0">            {filterProducts.map((item) => (
            <ProductItem
              key={item._id}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 font-medium">No products match your criteria.</p>
            <button
              onClick={() => { setCategory([]); setSubCategory([]); }}
              className="mt-4 text-sm font-bold text-black underline underline-offset-4 hover:text-zinc-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Collection />
    </Suspense>
  );
}