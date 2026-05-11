"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import { assets } from "@/assets/assets";

// 🟢 Premium Shadcn & Lucide Imports
import { ShoppingCart, User, Search, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    router.push("/login");
  };

  // 🟢 NEW: "Teleport" Search Logic
  // This ensures that clicking search from Home/About/Contact takes the user to the Collection page
  const handleSearchClick = () => {
    console.log('Search clicked, current pathname:', pathname);
    if (pathname.includes('/collection')) {
      // 🟢 If already on collection page, toggle the bar on and off
      setShowSearch(prev => {
        console.log('Toggling showSearch from', prev, 'to', !prev);
        return !prev;
      });
    } else {
      // 🟢 If elsewhere, force it open and move to the collection page
      console.log('Setting showSearch to true and navigating to collection');
      setShowSearch(true);
      router.push('/collection');
    }
  };

  const getNavLinkClasses = (isActive: boolean) =>
    `relative flex flex-col items-center gap-1 hover:text-black transition-colors ${isActive ? "text-black after:block after:h-[2px] after:w-1/2 after:bg-black after:absolute after:-bottom-1" : "text-gray-500"
    }`;

  return (
    // Navbar.tsx
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-medium">

        {/* Logo */}
        <Link href="/">
          <img src={assets.logo} className="w-32 hover:opacity-80 transition-opacity" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-8 text-sm uppercase tracking-wider">
          <Link href="/" className={getNavLinkClasses(pathname === "/")}>HOME</Link>
          <Link href="/collection" className={getNavLinkClasses(pathname === "/collection")}>COLLECTION</Link>
          <Link href="/about" className={getNavLinkClasses(pathname === "/about")}>ABOUT</Link>
          <Link href="/contact" className={getNavLinkClasses(pathname === "/contact")}>CONTACT</Link>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* 🟢 UPDATED: Using the new handleSearchClick */}
          <Button variant="ghost" size="icon" onClick={handleSearchClick}>
            <Search className="w-5 h-5 text-gray-700" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="focus-visible:ring-0">
                    <User className="w-5 h-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 font-medium">
                  <DropdownMenuItem className="cursor-pointer py-2">My Profile</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-2" onClick={() => router.push("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-700" onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
                <User className="w-5 h-5 text-gray-700" />
              </Button>
            )}
          </div>

          {/* Cart Icon with Shadcn Badge */}
          <Link href="/cart" className="relative mt-1">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </Button>
            {getCartCount() > 0 && (
              <Badge className="absolute top-0 right-0 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] rounded-full">
                {getCartCount()}
              </Badge>
            )}
          </Link>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] flex flex-col p-0 bg-white border-l border-zinc-100">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* 1. Brand Section */}
                <div className="p-8 border-b border-zinc-50 bg-white">
                  <img src={assets.logo} className="w-20" alt="Logo" />
                  <p className="text-[9px] text-zinc-400 font-medium tracking-[0.3em] uppercase mt-3">
                    Established 2026
                  </p>
                </div>

                {/* 2. Main Navigation */}
                <nav className="flex-1 px-6 py-10 bg-white">
                  <div className="flex flex-col gap-4">
                    {[
                      { name: "Home", path: "/" },
                      { name: "Collection", path: "/collection" },
                      { name: "About", path: "/about" },
                      { name: "Contact", path: "/contact" },
                    ].map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          href={link.path}
                          className={`flex items-center justify-between py-4 transition-all group ${pathname === link.path
                            ? "text-black"
                            : "text-zinc-500 hover:text-black"
                            }`}
                        >
                          <span className={`text-sm tracking-[0.15em] uppercase transition-all ${pathname === link.path ? "font-semibold" : "font-medium"
                            }`}>
                            {link.name}
                          </span>

                          {pathname === link.path ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          ) : (
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300" />
                          )}
                        </Link>
                      </SheetClose>
                    ))}

                    {/* 🟢 Mobile Search Shortcut */}
                    <SheetClose asChild>
                      <button
                        onClick={handleSearchClick}
                        className="flex items-center justify-between py-4 text-zinc-500 hover:text-black transition-all group"
                      >
                        <span className="text-sm tracking-[0.15em] uppercase font-medium">Search</span>
                        <Search className="w-4 h-4 text-zinc-300" />
                      </button>
                    </SheetClose>
                  </div>
                </nav>

                {/* 3. Footer */}
                <div className="p-8 bg-white border-t border-zinc-50">
                  <div className="flex flex-col gap-6">
                    {!token ? (
                      <SheetClose asChild>
                        <Button
                          onClick={() => router.push("/login")}
                          variant="outline"
                          className="w-full border-black text-black rounded-full h-12 text-[10px] font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                        >
                          LOGIN / REGISTER
                        </Button>
                      </SheetClose>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-zinc-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Account</span>
                            <button onClick={logout} className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors text-left uppercase">
                              Sign Out
                            </button>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-300" />
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;