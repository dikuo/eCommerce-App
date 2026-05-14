'use client';

import {  useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from "react";
import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import { assets } from "@/assets/assets";
import { useShop } from "@/context/ShopContext";
import axios from "axios";
import { toast } from "sonner";
import type { Product } from "@shared/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, Wallet } from "lucide-react";

// --- Types ---
type AddressFormData = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
};

type OrderProduct = Product & {
  size: string;
  quantity: number;
};

type OrderResponse = {
  success: boolean;
  message: string;
  session_url?: string;
  approval_url?: string;
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // 🟢 Local state for products
  const router = useRouter();

  const { backendUrl, token, cartItems, setCartItems, delivery_fee } = useShop();

  const [formData, setFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // 1. Fetch products locally on mount for checkout accuracy
  useEffect(() => {
    setIsMounted(true);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error(error);
        toast.error("Checkout Sync Error", { description: "Unable to verify product prices." });
      }
    };
    fetchProducts();
  }, [backendUrl]);

  // 2. Calculate subtotal locally based on the fetched products
  const subtotal = useMemo(() => {
    let total = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            total += itemInfo.price * cartItems[itemId][size];
          }
        }
      }
    }
    return total;
  }, [cartItems, products]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const orderItems: any[] = [];

      // Structure the order items from the cart
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = products.find((p) => p._id === itemId);
            if (itemInfo) {
              orderItems.push({
                ...itemInfo,
                size: size,
                quantity: cartItems[itemId][size]
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: subtotal + delivery_fee, // Subtotal + Shipping
      };

      if (!token) {
        toast.error("Authentication Required", { description: "Please sign in to place your order." });
        return;
      }

      // --- Payment Method Routing ---
      switch (method) {
        case "cod": {
          const response = await axios.post<OrderResponse>(`${backendUrl}/api/order/place`, orderData, {
            headers: { token },
          });
          if (response.data.success) {
            setCartItems({});
            router.push("/orders");
            toast.success("Order Successful", { description: "Your order has been placed via Cash on Delivery." });
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "stripe": {
          const response = await axios.post<OrderResponse>(`${backendUrl}/api/order/stripe`, orderData, {
            headers: { token },
          });
          if (response.data.success && response.data.session_url) {
            window.location.replace(response.data.session_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "paypal": {
          const response = await axios.post<OrderResponse>(`${backendUrl}/api/order/paypal`, orderData, {
            headers: { token },
          });
          if (response.data.success && response.data.approval_url) {
            window.location.replace(response.data.approval_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Checkout Failure", { description: "We could not process your request. Please try again." });
    }
  };

  if (!isMounted) return null;

  // Reusable Form Input
  const InputField = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      required
      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-400 text-zinc-900"
    />
  );

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row justify-between gap-16 pt-10 pb-24 border-t border-zinc-100">
      
      {/* --- Left Side: Delivery Information --- */}
      <div className="flex flex-col gap-6 w-full lg:max-w-[500px]">
        <div className="mb-4">
          <Title text1={"DELIVERY"} text2={"INFO"} />
        </div>
        
        <div className="flex gap-4">
          <InputField name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First name" />
          <InputField name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last name" />
        </div>
        
        <InputField name="email" type="email" value={formData.email} onChange={onChangeHandler} placeholder="Email address" />
        <InputField name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street address" />
        
        <div className="flex gap-4">
          <InputField name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" />
          <InputField name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" />
        </div>
        
        <div className="flex gap-4">
          <InputField name="zipcode" type="number" value={formData.zipcode} onChange={onChangeHandler} placeholder="Zipcode" />
          <InputField name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" />
        </div>
        
        <InputField name="phone" type="number" value={formData.phone} onChange={onChangeHandler} placeholder="Phone number" />
      </div>

      {/* --- Right Side: Order Summary & Payment --- */}
      <div className="flex-1 lg:max-w-[450px]">
        <div className="bg-zinc-50/50 p-8 rounded-3xl border border-zinc-100 shadow-sm">
          
          {/* 🟢 Passing the local subtotal to CartTotal */}
          <CartTotal subtotal={subtotal} />
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <CreditCard className="w-4 h-4 text-zinc-400" />
               <h3 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-400">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Payment Methods Logic remains consistent */}
              <div 
                onClick={() => setMethod("stripe")} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  method === "stripe" ? "border-black bg-white shadow-md" : "border-zinc-100 bg-white/50 grayscale opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === "stripe" ? "border-black" : "border-zinc-200"}`}>
                    {method === "stripe" && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div className="relative h-5 w-12">
                    <Image fill src={assets.stripe_logo} alt="Stripe" className="object-contain" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setMethod("paypal")} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  method === "paypal" ? "border-black bg-white shadow-md" : "border-zinc-100 bg-white/50 grayscale opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === "paypal" ? "border-black" : "border-zinc-200"}`}>
                    {method === "paypal" && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div className="relative h-5 w-16">
                    <Image fill src={assets.paypal_logo} alt="PayPal" className="object-contain" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setMethod("cod")} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  method === "cod" ? "border-black bg-white shadow-md" : "border-zinc-100 bg-white/50 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === "cod" ? "border-black" : "border-zinc-200"}`}>
                    {method === "cod" && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Cash on Delivery</p>
                </div>
                <Wallet className="w-4 h-4 text-zinc-300" />
              </div>
            </div>

            <div className="pt-8">
              <Button 
                type="submit" 
                className="w-full bg-black text-white rounded-full py-8 font-black text-xs tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                Confirm Order
              </Button>
              <div className="flex items-center justify-center gap-2 mt-6 text-zinc-400">
                <Truck className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout Powered by CaraStyle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;