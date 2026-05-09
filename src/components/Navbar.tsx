"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green-600">
          🌯 WrapUp
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-gray-700 hover:text-green-600 transition" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}