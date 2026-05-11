"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

export default function WrapCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 w-full bg-gray-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">
            🌯
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-green-600 font-bold text-lg">
            KSh {item.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}