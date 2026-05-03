// shared/src/types.ts

// 1. The Core Product Model
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestseller: boolean;
    date: number;
}

// 2. The Cart Item (Product + selected size/quantity)
export interface CartItem {
    productId: string;
    size: string;
    quantity: number;
}

// 3. User & Auth
export interface User {
    _id: string;
    name: string;
    email: string;
    cartData: Record<string, Record<string, number>>; // Nested object structure used in tutorial
}

// 4. Order Details (For Backend & Admin)
export interface Order {
    _id: string;
    userId: string;
    items: CartItem[];
    amount: number;
    address: object;
    status: 'Order Placed' | 'Packing' | 'Shipped' | 'Out for delivery' | 'Delivered';
    paymentMethod: string;
    payment: boolean;
    date: number;
}