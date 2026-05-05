"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import { assets } from "@/assets/assets";

// 🟢 Premium Shadcn & Lucide Imports
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
  // Notice we deleted the `visible` state! Shadcn's <Sheet> handles it automatically.
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    router.push("/login");
  };

  // NavLink styling helper for that clean underline effect
  const getNavLinkClasses = (isActive: boolean) =>
    `relative flex flex-col items-center gap-1 hover:text-black transition-colors ${
      isActive ? "text-black after:block after:h-[2px] after:w-1/2 after:bg-black after:absolute after:-bottom-1" : "text-gray-500"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
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

        {/* Actions (Search, Profile, Cart, Mobile Menu) */}
        <div className="flex items-center gap-2">
          
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
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

          {/* Mobile Navigation (Shadcn Sheet) */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-6 pt-12">
                {/* Screen readers require a title for accessibility */}
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <nav className="flex flex-col gap-4 text-lg">
                  <Link href="/" className="py-2 border-b border-gray-100 uppercase tracking-widest">Home</Link>
                  <Link href="/collection" className="py-2 border-b border-gray-100 uppercase tracking-widest">Collection</Link>
                  <Link href="/about" className="py-2 border-b border-gray-100 uppercase tracking-widest">About</Link>
                  <Link href="/contact" className="py-2 border-b border-gray-100 uppercase tracking-widest">Contact</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;