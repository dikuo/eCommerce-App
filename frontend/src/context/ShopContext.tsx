import { createContext, ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import axios from "axios";
import type { Product, User } from "@shared/types";

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
  navigate: NavigateFunction;
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
  navigate: (() => {
    throw new Error("ShopContextProvider is not mounted");
  }) as NavigateFunction,
});

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = ({ children }: ShopContextProviderProps) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // 1. useCallback + Functional State Update
  // By using `prevCart`, we don't need `cartItems` in the dependency array.
  // This prevents the function from being recreated every time the cart changes.
  const addToCart = useCallback(async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select Product Size.");
      return;
    }

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

    toast.success("Item added to cart");
    
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error((error as Error).message);
      }
    }
  }, [backendUrl, token]);

  // 2. useCallback for Stable References
  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  }, [cartItems]);

  const updateQuantity = useCallback(async (itemId: string, size: string, quantity: number) => {
    setCartItems((prevCart) => {
      const cartData = structuredClone(prevCart) as CartData;
      cartData[itemId][size] = quantity;
      return cartData;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error((error as Error).message);
      }
    }
  }, [backendUrl, token]);

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        if (itemInfo && cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
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
      console.log(error);
      toast.error((error as Error).message);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async (tokenValue: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: tokenValue } });
      if (response.data.success) {
        setCartItems(response.data.cartData as CartData);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
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

  // 3. Memoize the Final Context Value
  // This is the most critical fix. The Provider will only broadcast a change 
  // if one of these specific dependencies actually updates.
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
    token
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;