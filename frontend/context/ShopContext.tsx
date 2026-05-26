'use client';

import { createContext, ReactNode, useEffect, useState, useMemo, useCallback, useContext } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { User, Product } from "@shared/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type CartData = User["cartData"];

export interface ShopContextValue {
  currency: string;
  delivery_fee: number;
  backendUrl: string;
  search: string;
  setSearch: (value: string) => void;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartData;
  setCartItems: React.Dispatch<React.SetStateAction<CartData>>;
  token: string;
  setToken: (value: string) => void;
  addToCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  navigate: AppRouterInstance;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export const ShopContext = createContext<ShopContextValue | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;

  /**
   * 🟢 SMART RUNTIME URL ROUTER
   * Forces the browser client to use relative pathways ("") so Next.js rewrites can intercept them.
   * On the server side, it maps cleanly to internal container DNS lines.
   */
  const backendUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return process.env.KUBERNETES_SERVICE_HOST
        ? "http://backend-service:8080"
        : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080");
    }
    return ""; // Relative path identifier for client execution
  }, []);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartData>({});
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = useRouter();

  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalCount += cartItems[itemId][size];
        }
      }
    }
    return totalCount;
  }, [cartItems]);

  const addToCart = useCallback(async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Size Required");
      return;
    }

    setCartItems((prev) => {
      const newData = structuredClone(prev);
      if (!newData[itemId]) newData[itemId] = {};
      newData[itemId][size] = (newData[itemId][size] || 0) + 1;
      return newData;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.error("Cart sync failed:", error);
      }
    }
  }, [token, backendUrl]);

  const updateQuantity = useCallback(async (itemId: string, size: string, quantity: number) => {
    setCartItems((prev) => {
      const newData = structuredClone(prev);
      if (newData[itemId]) {
        newData[itemId][size] = quantity;
      }
      return newData;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error("Failed to sync cart update");
      }
    }
  }, [token, backendUrl]);

  // 🟢 Fetch all products on mount using relative proxy channels
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) return;

      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch products through cluster gateway:", error);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token]);

  const value = useMemo(() => ({
    currency,
    delivery_fee,
    backendUrl,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    token,
    setToken,
    navigate,
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
  }), [search, showSearch, cartItems, token, navigate, getCartCount, addToCart, updateQuantity, backendUrl, products, selectedProduct]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopContextProvider");
  }
  return context;
};