'use client';

import { useContext } from "react";
import { useShop } from "@/context/ShopContext";
import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";

const QuickViewModal = () => {
  const { selectedProduct, setSelectedProduct, currency, addToCart } = useShop();
  const router = useRouter();

  if (!selectedProduct) return null;
  
  const handleViewDetails = () => {
    router.push(`/product/${selectedProduct._id}`);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute right-4 top-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 aspect-[4/5] relative bg-zinc-100">
          <Image 
            src={selectedProduct.image[0]} 
            alt={selectedProduct.name} 
            fill 
            className="object-cover"
            // unoptimized={selectedProduct.image[0]?.includes('cloudinary.com')} // Handle external URLs
            priority
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
            {selectedProduct.category} / {selectedProduct.subCategory}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mb-4">
            {selectedProduct.name}
          </h2>
          <p className="text-xl font-bold text-black mb-6">
            {currency}{selectedProduct.price}
          </p>
          
          <p className="text-zinc-600 leading-relaxed mb-8">
            {selectedProduct.description || "Elevate your style with this premium piece, designed for comfort and durability."}
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => {
                addToCart(selectedProduct._id, "M"); // Defaulting to M or adding size logic
                setSelectedProduct(null);
              }}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              ADD TO CART
            </button>
            
            <button 
              onClick={handleViewDetails}
              className="w-full text-zinc-500 text-sm font-medium hover:text-black transition-colors"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;