'use client';

import { useContext, useEffect, type ChangeEvent } from "react";
import { ShopContext } from "@/context/ShopContext";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const pathname = usePathname();

  const isCollectionPage = pathname.includes("collection");

  // 1. Auto-close search if we leave the collection page
  useEffect(() => {
    if (!isCollectionPage) {
      setShowSearch(false);
    }
  }, [isCollectionPage, setShowSearch]);

  // 🟢 2. Clear search keyword when the bar is closed
  useEffect(() => {
    if (!showSearch) {
      setSearch("");
    }
  }, [showSearch, setSearch]);

  // 3. Keyboard Listener for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSearch, setShowSearch]);

  if (!showSearch || !isCollectionPage) return null;

  return (
    <div
      // Using your new z-index logic (40) to stay above Navbar (30)
      className="fixed top-28 left-0 w-full z-40 px-4 h-20 flex items-center bg-white/90 backdrop-blur-md border-b border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="max-w-3xl mx-auto w-full relative group">

        <div className="flex items-center gap-4 bg-white border border-zinc-200 shadow-xl shadow-zinc-200/40 rounded-full px-6 py-3 transition-all duration-300">

          <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />

          <input
            autoFocus
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-medium"
            type="text"
            placeholder="Search our collection..."
          />

          <button
            onClick={() => setShowSearch(false)}
            className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400 hover:text-black" />
          </button>
        </div>

        <div className="mt-3 text-center pointer-events-none">
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;