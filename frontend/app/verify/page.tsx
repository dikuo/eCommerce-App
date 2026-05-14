'use client';

import { useEffect, Suspense } from "react";
import { useShop } from "@/context/ShopContext";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

// We separate the logic into a sub-component so we can wrap it in <Suspense>
const VerifyLogic = () => {
  const { token, setCartItems, backendUrl } = useShop();
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const provider = searchParams.get("provider") || "stripe";
  const paypalOrderId = searchParams.get("token");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return;
      }

      let response;
      if (provider === "paypal") {
        response = await axios.post(
          backendUrl + "/api/order/verifyPaypal",
          { success, orderId, paypalOrderId },
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          backendUrl + "/api/order/verifyStripe",
          { success, orderId },
          { headers: { token } }
        );
      }

      if (response.data.success) {
        setCartItems({});
        router.push("/orders");
      } else {
        router.push("/cart");
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
      router.push("/cart"); // Safety redirect
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {/* A simple spinner so the user knows something is happening */}
      <div className="animate-spin border-4 border-gray-300 border-t-black rounded-full h-12 w-12"></div>
    </div>
  );
};

// Main Page Component
const Verify = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyLogic />
    </Suspense>
  );
};

export default Verify;