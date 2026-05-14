// components/CartTotal.tsx
"use client";

import { useShop } from "@/context/ShopContext";
import Title from "@/components/Title";

// 🟢 Accept subtotal as a prop
const CartTotal = ({ subtotal }: { subtotal: number }) => {
  const { currency, delivery_fee } = useShop();

  const total = subtotal === 0 ? 0 : subtotal + Number(delivery_fee);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{currency} {subtotal}.00</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency} {Number(delivery_fee)}.00</p>
        </div>
        <div className="flex justify-between">
          <b>Total</b>
          <b>{currency} {total}.00</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;