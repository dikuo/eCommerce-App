import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.tsx";
import { assets } from "../assets/assets.js";

// 🟢 Premium Shadcn & Lucide Imports
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Badge } from "./ui/badge.tsx";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet.tsx";
import { Separator } from "./ui/separator.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";

const Navbar = () => {
  // Notice we deleted the `visible` state! Shadcn's <Sheet> handles it automatically.
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  // NavLink styling helper for that clean underline effect
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center gap-1 hover:text-black transition-colors ${
      isActive ? "text-black after:block after:h-[2px] after:w-1/2 after:bg-black after:absolute after:-bottom-1" : "text-gray-500"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-medium">
        
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="w-32 hover:opacity-80 transition-opacity" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-8 text-sm uppercase tracking-wider">
          <NavLink to="/" className={navLinkClasses}>HOME</NavLink>
          <NavLink to="/collection" className={navLinkClasses}>COLLECTION</NavLink>
          <NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink>
          <NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink>
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
                  <DropdownMenuItem className="cursor-pointer py-2" onClick={() => navigate("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-700" onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
                <User className="w-5 h-5 text-gray-700" />
              </Button>
            )}
          </div>

          {/* Cart Icon with Shadcn Badge */}
          <Link to="/cart" className="relative mt-1">
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
                  <NavLink to="/" className="py-2 border-b border-gray-100 uppercase tracking-widest">Home</NavLink>
                  <NavLink to="/collection" className="py-2 border-b border-gray-100 uppercase tracking-widest">Collection</NavLink>
                  <NavLink to="/about" className="py-2 border-b border-gray-100 uppercase tracking-widest">About</NavLink>
                  <NavLink to="/contact" className="py-2 border-b border-gray-100 uppercase tracking-widest">Contact</NavLink>
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