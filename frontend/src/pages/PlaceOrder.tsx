import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import Title from "../components/Title.tsx";
import CartTotal from "../components/CartTotal.tsx";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import type { Product } from "@shared/types";

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
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } =
    useContext(ShopContext);
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const orderItems: OrderProduct[] = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
              orderItems.push({ ...itemInfo, size: item, quantity: cartItems[items][item] });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (!token) {
        toast.error("Unable to place order without a token.");
        return;
      }

      const response = await axios.post<OrderResponse>(backendUrl + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
        return;
      }

      switch (method) {
        case "stripe": {
          const responseStripe = await axios.post<OrderResponse>(backendUrl + "/api/order/stripe", orderData, {
            headers: { token },
          });
          if (responseStripe.data.success && responseStripe.data.session_url) {
            window.location.replace(responseStripe.data.session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }
        case "paypal": {
          const responsePaypal = await axios.post<OrderResponse>(backendUrl + "/api/order/paypal", orderData, {
            headers: { token },
          });

          if (responsePaypal.data.success && responsePaypal.data.approval_url) {
            window.location.replace(responsePaypal.data.approval_url);
          } else {
            toast.error(responsePaypal.data.message);
          }
          break;
        }
        default:
          toast.error(response.data.message);
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod("paypal")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "paypal" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.paypal_logo} alt="" />
            </div>
            <div onClick={() => setMethod("cod")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm cursor-pointer">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
