'use client';

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import axios from "axios";
import type { Order } from "@shared/types";
import Image from "next/image";
import { Package, Truck, CheckCircle2, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Interfaces ---
interface OrderItemWithStatus {
  _id: string;
  name: string;
  image: string[];
  price: number;
  size: string;
  quantity: number;
  status: Order["status"];
  payment: boolean;
  paymentMethod: string;
  date: number;
}

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState<OrderItemWithStatus[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        const allOrdersItem: any[] = [];
        response.data.orders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            allOrdersItem.push({ ...item, status: order.status, paymentMethod: order.paymentMethod, date: order.date });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadOrderData();
  }, [token]);

  if (!isMounted) return null;

  return (
    <div className="pt-14 min-h-[80vh] pb-20">
      <div className="mb-10 opacity-80"> {/* 🟢 Slightly faded title for lightness */}
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="space-y-4">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-zinc-100 rounded-3xl p-6 transition-all hover:border-zinc-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              {/* 1. Product Info (Lightened) */}
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-20 bg-zinc-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.image[0]} alt={item.name} fill className="object-contain p-2" sizes="64px" />
                </div>

                <div className="space-y-1">
                  {/* Changed from font-black to font-medium */}
                  <h3 className="text-sm font-medium text-zinc-900 tracking-tight">
                    {item.name}
                  </h3>
                  
                  {/* Lighter detail row */}
                  <div className="flex items-center gap-3 text-[11px] font-normal text-zinc-400">
                    <p>{currency}{item.price}</p>
                    <span className="w-1 h-1 rounded-full bg-zinc-100" />
                    <p>Qty: {item.quantity}</p>
                    <span className="w-1 h-1 rounded-full bg-zinc-100" />
                    <span className="text-zinc-600 font-medium uppercase">{item.size}</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                      Placed on <span className="text-zinc-500">{new Date(item.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Status & Button (Lighter Weights) */}
              <div className="flex flex-row items-center justify-between md:justify-end gap-6 md:w-1/2">
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 opacity-40" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-900">
                    {item.status}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  onClick={loadOrderData}
                  disabled={loading}
                  className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black transition-all group p-0 h-auto"
                >
                  {loading ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="flex items-center">
                      Track Order
                      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;