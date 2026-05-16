// frontend/utils/mockData.ts
import type { Product } from "@shared/types";

export const ciMockProducts: Product[] = [
  {
    _id: "660d1a2b3c4d5e6f7a8b9c01",
    name: "Classic Crimson Hoodie",
    description: "Premium weight cotton blend overhead hoodie.",
    price: 85,
    image: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: true,
    date: Date.now()
  },
  {
    _id: "660d1a2b3c4d5e6f7a8b9c02",
    name: "Midnight Bomber Jacket",
    description: "Water-resistant satin finish bomber jacket.",
    price: 120,
    image: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"],
    category: "Men",
    subCategory: "Outerwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    date: Date.now()
  },
  {
    _id: "660d1a2b3c4d5e6f7a8b9c03",
    name: "Minimalist Knit Sweater",
    description: "Soft merino wool blend crewneck sweater.",
    price: 95,
    image: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["XS", "S", "M", "L"],
    bestseller: false,
    date: Date.now()
  }
];