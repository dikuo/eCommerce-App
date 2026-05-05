"use client";

import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { ShopContext } from "@/context/ShopContext";
import { assets } from "@/assets/assets";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <Image width={16} height={16} className="w-4" src={assets.search_icon} alt="Search" />
      </div>
      <Image onClick={() => setShowSearch(false)} width={12} height={12} className="inline w-3 cursor-pointer" src={assets.cross_icon} alt="Close" />
    </div>
  ) : null;
};

export default SearchBar;
