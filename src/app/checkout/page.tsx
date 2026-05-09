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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return alert("Please fill in all fields.");
    if (items.length === 0) return alert("Your cart is empty.");
    setLoading(true);

    try {
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
      if (!mpesaResult.success) throw new Error(mpesaResult.error);

      await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          message: `Hi ${form.name}! Your WrapUp order has been received. Total: KSh ${total()}. We'll notify you when it's ready. 🌯`,
        }),
      });

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
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <p
          style={{
            color: "var(--green-mid)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            fontFamily: "'DM Sans', sans-serif",
          }}
          className="uppercase mb-2"
        >
          Almost there
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-dark)",
            fontWeight: 600,
          }}
          className="mb-12"
        >
          Checkout
        </h1>

        {/* Details */}
        <div
          style={{
            backgroundColor: "var(--warm-white)",
            border: "1px solid #e8e4dc",
            borderRadius: "16px",
            padding: "28px",
          }}
          className="mb-6"
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--text-dark)",
            }}
            className="mb-6"
          >
            Your Details
          </h2>

          <div className="space-y-5">
            <div>
              <label
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
                className="uppercase block mb-2"
              >
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Marlene Wanjiku"
                style={{
                  width: "100%",
                  border: "1px solid #e8e4dc",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--text-dark)",
                  backgroundColor: "var(--cream)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
                className="uppercase block mb-2"
              >
                M-Pesa Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                style={{
                  width: "100%",
                  border: "1px solid #e8e4dc",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--text-dark)",
                  backgroundColor: "var(--cream)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
                className="uppercase block mb-2"
              >
                Order Type
              </label>
              <select
                name="delivery"
                value={form.delivery}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "1px solid #e8e4dc",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "var(--text-dark)",
                  backgroundColor: "var(--cream)",
                  outline: "none",
                }}
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {form.delivery === "delivery" && (
              <div>
                <label
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                  }}
                  className="uppercase block mb-2"
                >
                  Delivery Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Westlands, Nairobi"
                  style={{
                    width: "100%",
                    border: "1px solid #e8e4dc",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    color: "var(--text-dark)",
                    backgroundColor: "var(--cream)",
                    outline: "none",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div
          style={{
            backgroundColor: "var(--warm-white)",
            border: "1px solid #e8e4dc",
            borderRadius: "16px",
            padding: "28px",
          }}
          className="mb-8"
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--text-dark)",
            }}
            className="mb-5"
          >
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                fontWeight: 300,
                color: "var(--text-muted)",
              }}
            >
              <span>{item.name} × {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div
            className="flex justify-between pt-5 mt-3"
            style={{ borderTop: "1px solid #e8e4dc" }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "var(--text-dark)",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "var(--green-deep)",
              }}
            >
              KSh {total().toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: loading ? "#d4cfc6" : "var(--green-deep)",
            color: loading ? "var(--text-muted)" : "var(--warm-white)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            fontWeight: 500,
            padding: "18px",
            borderRadius: "99px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          className="uppercase"
        >
          {loading ? "Sending M-Pesa request..." : `Pay KSh ${total().toLocaleString()} via M-Pesa`}
        </button>

        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.78rem",
            fontWeight: 300,
            textAlign: "center",
          }}
          className="mt-4"
        >
          You'll receive an M-Pesa prompt on your phone to complete payment.
        </p>
      </div>
    </main>
  );
}