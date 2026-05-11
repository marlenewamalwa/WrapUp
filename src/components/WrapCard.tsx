"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

export default function WrapCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [withChilli, setWithChilli] = useState(false);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: withChilli ? `${item.name} (With Chilli)` : item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--warm-white)",
        border: "1px solid #e8e4dc",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="group hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div
        style={{ backgroundColor: "var(--green-pale)", height: 200, position: "relative" }}
        className="overflow-hidden"
      >
        {item.image_url ? (
          <img
  src={item.image_url}
  alt={item.name}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
  className="group-hover:scale-105 transition-transform duration-500"
/>
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            🌯
          </div>
        )}
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "var(--warm-white)",
            color: "var(--green-mid)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: "99px",
          }}
          className="uppercase"
        >
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "var(--text-dark)",
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
          }}
          className="mt-1 line-clamp-2"
        >
          {item.description}
        </p>

        {/* Chilli toggle */}
        <div
          className="flex items-center gap-2 mt-4"
          onClick={() => setWithChilli(!withChilli)}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              border: withChilli ? "none" : "1.5px solid #d4cfc6",
              backgroundColor: withChilli ? "var(--green-mid)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            {withChilli && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              color: withChilli ? "var(--green-mid)" : "var(--text-muted)",
              fontWeight: 300,
              userSelect: "none",
              transition: "color 0.2s ease",
            }}
          >
            🌶️ With Chilli
          </span>
        </div>

        <div className="flex items-center justify-between mt-5">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "var(--green-deep)",
            }}
          >
            KSh {item.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: added ? "var(--green-pale)" : "var(--green-deep)",
              color: added ? "var(--green-mid)" : "var(--warm-white)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}