'use client';

import { useEffect, useState, useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import type { Product } from "@shared/types";

const Cart = () => {
  // 1. Removed 'products' from context; added 'backendUrl'
  const { currency, cartItems, updateQuantity, backendUrl, products: contextProducts } = useShop();

  const [products, setProducts] = useState<Product[]>([]); // 🟢 Local product state
  const [cartData, setCartData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // 2. Fetch products locally on mount
  useEffect(() => {
    setIsMounted(true);

    if (contextProducts.length > 0) {
      setProducts(contextProducts);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    };
    fetchProducts();
  }, [backendUrl, contextProducts]);

  // 3. Transform cartItems into a flat list for rendering
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              productId: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // 4. Calculate Subtotal locally to pass to CartTotal
  const subtotal = useMemo(() => {
    let total = 0;
    cartData.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  }, [cartData, products]);

  if (!isMounted) return null;

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-zinc-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">Your bag is empty</h2>
          <p className="text-zinc-500 max-w-[280px]">Looks like you haven't added anything to your bag yet.</p>
        </div>
        <Button
          onClick={() => router.push('/collection')}
          className="rounded-full px-10 py-6 bg-black text-white hover:bg-zinc-800 transition-all font-bold tracking-widest text-xs uppercase"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-14 transition-all duration-700">
      <div className="mb-10">
        <Title text1={"YOUR"} text2={"BAG"} />
      </div>

      <div className="space-y-2">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item.productId);
          if (!productData) return null;

          return (
            <div key={`${item.productId}-${item.size}`} className="group">
              <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
                <div className="relative w-24 h-28 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 flex-shrink-0">
                  <Image
                    fill
                    src={productData.image[0]}
                    alt={productData.name}
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                    {productData.name}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <p className="text-zinc-500 text-sm">{currency}{productData.price}</p>
                    <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase">
                      {item.size}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-zinc-200 rounded-full bg-white px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:text-black text-zinc-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-1 hover:text-black text-zinc-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => updateQuantity(item.productId, item.size, 0)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {index !== cartData.length - 1 && <Separator className="bg-zinc-100/50" />}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-12 mb-20">
        <div className="w-full sm:w-[400px]">
          {/* 🟢 Passing the locally calculated subtotal */}
          <CartTotal subtotal={subtotal} />

          <div className="mt-8">
            <Button
              onClick={() => router.push("/place-order")}
              className="w-full bg-black text-white rounded-full py-6 font-black text-[10px] tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              PROCEED TO CHECKOUT
            </Button>
            <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium uppercase tracking-widest">
              Standard flat-rate shipping applied
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;