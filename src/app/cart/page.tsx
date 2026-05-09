"use client";

import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-7xl mb-6">🌯</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-5 ${
                index !== items.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Image / Emoji */}
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} width={64} height={64} className="object-cover" />
                ) : (
                  <span className="text-3xl">🌯</span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-green-600 font-medium text-sm">
                  KSh {item.price.toLocaleString()}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right w-24">
                <p className="font-semibold text-gray-800">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>KSh {total().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-gray-600">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-gray-800 border-t pt-4 mb-6">
            <span>Total</span>
            <span>KSh {total().toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-green-600 text-white text-center py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}