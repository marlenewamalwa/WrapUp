"use client";

import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-center px-4">
          <span className="text-6xl mb-8">🌯</span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              color: "var(--text-dark)",
              fontWeight: 600,
            }}
            className="mb-3"
          >
            Your cart is empty
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
            }}
            className="mb-10"
          >
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/"
            style={{
              backgroundColor: "var(--green-deep)",
              color: "var(--warm-white)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
            className="uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p
          style={{
            color: "var(--green-mid)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            fontFamily: "'DM Sans', sans-serif",
          }}
          className="uppercase mb-2"
        >
          Review your order
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
          Your Cart
        </h1>

        {/* Items */}
        <div
          style={{
            backgroundColor: "var(--warm-white)",
            border: "1px solid #e8e4dc",
            borderRadius: "16px",
            overflow: "hidden",
          }}
          className="mb-6"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                borderBottom: index !== items.length - 1 ? "1px solid #e8e4dc" : "none",
                padding: "20px 24px",
              }}
              className="flex items-center gap-4"
            >
              {/* Image */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  backgroundColor: "var(--green-pale)",
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
                className="flex items-center justify-center"
              >
               {item.image_url ? (
  <img
    src={item.image_url}
    alt={item.name}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
) : (
  <span className="text-2xl">🌯</span>
)}
              </div>

              {/* Name & price */}
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    color: "var(--green-mid)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                  }}
                >
                  KSh {item.price.toLocaleString()}
                </p>
              </div>

              {/* Quantity */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: "1px solid #e8e4dc",
                  borderRadius: "99px",
                  padding: "4px 12px",
                  backgroundColor: "var(--cream)",
                }}
              >
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "var(--text-dark)",
                    minWidth: 16,
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal & remove */}
              <div className="text-right" style={{ minWidth: 80 }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                  }}
                >
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    color: "#c9897a",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          style={{
            backgroundColor: "var(--warm-white)",
            border: "1px solid #e8e4dc",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            className="flex justify-between mb-3"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 300,
            }}
          >
            <span>Subtotal</span>
            <span>KSh {total().toLocaleString()}</span>
          </div>
          <div
            className="flex justify-between mb-6"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 300,
            }}
          >
            <span>Delivery</span>
            <span style={{ color: "var(--green-mid)" }}>Free</span>
          </div>
          <div
            className="flex justify-between pt-5 mb-8"
            style={{
              borderTop: "1px solid #e8e4dc",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--text-dark)",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--green-deep)",
              }}
            >
              KSh {total().toLocaleString()}
            </span>
          </div>

          <Link
            href="/checkout"
            style={{
              display: "block",
              backgroundColor: "var(--green-deep)",
              color: "var(--warm-white)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              fontWeight: 500,
              textAlign: "center",
              padding: "16px",
              borderRadius: "99px",
            }}
            className="uppercase hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}