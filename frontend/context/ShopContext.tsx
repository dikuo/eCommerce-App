"use client";

import { createContext, ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Product, User } from "@shared/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type CartData = User["cartData"];

export interface ShopContextValue {
  currency: string;
  delivery_fee: number;
  backendUrl: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartData;
  setCartItems: React.Dispatch<React.SetStateAction<CartData>>;
  products: Product[];
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
  getCartAmount: () => number;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  navigate: AppRouterInstance; // 🟢 Added missing type
}

const defaultCartData: CartData = {};

export const ShopContext = createContext<ShopContextValue>({
  currency: "$",
  delivery_fee: 10,
  backendUrl: "",
  search: "",
  setSearch: () => {},
  showSearch: false,
  setShowSearch: () => {},
  cartItems: defaultCartData,
  setCartItems: () => {},
  products: [],
  token: "",
  setToken: () => {},
  addToCart: async () => {},
  getCartCount: () => 0,
  updateQuantity: async () => {},
  getCartAmount: () => 0,
  selectedProduct: null,
  setSelectedProduct: () => {},
  navigate: {} as AppRouterInstance,
});

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = ({ children }: ShopContextProviderProps) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useRouter();

  const addToCart = useCallback(async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Size Required", {
        description: "Please select a size before adding to cart."
      });
      return;
    }

    // Find product name for a better toast experience
    const product = products.find((p) => p._id === itemId);

    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart) as CartData;
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      return cartData;
    });

    toast.success("Added to bag", {
      description: product ? `${product.name} (${size}) is ready for checkout.` : "Item added to cart.",
      action: {
        label: "View Cart",
        onClick: () => navigate.push('/cart'),
      },
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error("Sync Failed", { description: "Could not update your cloud cart." });
      }
    }
  }, [backendUrl, token, products, navigate]);

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

  const updateQuantity = useCallback(async (itemId: string, size: string, quantity: number) => {
    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart) as CartData;
      if (cartData[itemId]) {
        cartData[itemId][size] = quantity;
      }
      return cartData;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error("Update Failed");
      }
    }
  }, [backendUrl, token]);

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      for (const size in cartItems[itemId]) {
        if (itemInfo && cartItems[itemId][size] > 0) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network Error", { description: "Could not fetch product catalog." });
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async (tokenValue: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: tokenValue } });
      if (response.data.success) {
        setCartItems(response.data.cartData as CartData);
      }
    } catch (error) {
      console.error(error);
    }
  }, [backendUrl]);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, [token, getUserCart]);

  const value = useMemo<ShopContextValue>(() => ({
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    selectedProduct,
    setSelectedProduct,
  }), [
    products, 
    search, 
    showSearch, 
    cartItems, 
    addToCart, 
    getCartCount, 
    updateQuantity, 
    getCartAmount, 
    navigate, 
    backendUrl, 
    token,
    selectedProduct,
    setSearch,
    setShowSearch,
    setCartItems,
    setToken,
    setSelectedProduct
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;