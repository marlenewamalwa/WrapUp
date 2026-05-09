"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  awaiting_payment: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-gray-100 text-gray-500",
  payment_failed: "bg-red-100 text-red-700",
};

const statusOptions = ["pending", "awaiting_payment", "confirmed", "ready", "delivered", "payment_failed"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
  await supabase.from("orders").update({ status }).eq("id", id);

  if (status === "ready") {
    const order = orders.find((o) => o.id === id);
    if (order) {
      await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: order.phone,
          message: `Hi ${order.customer_name}! Your WrapUp order is ready for pickup. Enjoy! 🌯`,
        }),
      });
    }
  }

  fetchOrders();
};

  useEffect(() => {
    if (!authed) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Admin Access</h1>
            <p className="text-gray-500 text-sm text-center mb-6">Enter your password to continue</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">Incorrect password</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => setAuthed(false)}
              className="text-sm text-red-400 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-20">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {order.customer_name}
                    </h3>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString("en-KE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      KSh {order.total.toLocaleString()}
                    </p>
                    {order.mpesa_ref && (
                      <p className="text-xs text-gray-400 mt-1">
                        Ref: {order.mpesa_ref}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{item.name} × {item.quantity}</span>
                      <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status.replace("_", " ")}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}