"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    delivery: "pickup",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!form.name || !form.phone) return alert("Please fill in all fields.");
  if (items.length === 0) return alert("Your cart is empty.");
  setLoading(true);

  try {
    // 1. Save order to Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name,
        phone: form.phone,
        items: items,
        total: total(),
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Trigger M-Pesa STK push
    const res = await fetch("/api/mpesa/stk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.phone,
        amount: total(),
        orderId: order.id,
      }),
    });

    const mpesaResult = await res.json();

    if (!mpesaResult.success) {
      throw new Error(mpesaResult.error || "M-Pesa request failed");
    }

    clearCart();
    router.push(`/order/${order.id}`);
  } catch (err) {
    console.error("Order failed:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Details</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Marlene Wanjiku"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">M-Pesa Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Order Type</label>
              <select
                name="delivery"
                value={form.delivery}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {form.delivery === "delivery" && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Delivery Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600 text-sm mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-800 text-lg">
            <span>Total</span>
            <span>KSh {total().toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-full font-semibold text-lg transition ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Placing order..." : `Pay KSh ${total().toLocaleString()} via M-Pesa`}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          You'll receive an M-Pesa prompt on your phone to complete payment.
        </p>
      </div>
    </main>
  );
}