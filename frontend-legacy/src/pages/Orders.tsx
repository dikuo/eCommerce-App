'use client';

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import axios from "axios";
import type { Order } from "@shared/types";
import Image from "next/image";

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

interface OrderResponseItem {
  _id: string;
  name: string;
  image: string[];
  price: number;
  size: string;
  quantity: number;
}

interface OrderResponse {
  status: Order["status"];
  payment: boolean;
  paymentMethod: string;
  date: number;
  items: OrderResponseItem[];
}

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState<OrderItemWithStatus[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Hydration Guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders", 
        {}, 
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem: OrderItemWithStatus[] = [];
        response.data.orders.forEach((order: OrderResponse) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  // Don't render until client-side hydration is complete
  if (!isMounted) return null;

  return (
    <div className="border-t pt-16 min-h-[70vh]">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="mt-8">
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                {/* Optimized Product Image */}
                <div className="relative w-16 sm:w-20 aspect-square flex-shrink-0">
                  <Image 
                    src={item.image[0]} 
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>

                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className="mt-1">
                    Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button 
                  onClick={loadOrderData} 
                  className="border px-4 py-2 text-sm font-medium rounded-sm active:bg-gray-50 transition-colors"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;