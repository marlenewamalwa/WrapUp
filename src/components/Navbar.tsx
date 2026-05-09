"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
     style={{ 
  backgroundColor: "rgba(8, 5, 0, 0.95)", 
  borderBottom: "1px solid #dce8dd",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
}}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "var(--green-deep)",
              letterSpacing: "0.02em",
            }}
          >
            WrapUp
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "var(--green-mid)",
              display: "inline-block",
              marginBottom: 2,
            }}
          />
        </Link>

        <div className="flex items-center gap-8">
  
        
          <Link href="/cart" className="relative">
            <ShoppingBag
              size={20}
              style={{ color: "var(--green-deep)" }}
              className="hover:opacity-70 transition-opacity"
            />
            {itemCount > 0 && (
              <span
                style={{
                  backgroundColor: "var(--green-mid)",
                  fontSize: "0.65rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                className="absolute -top-2 -right-2 text-white rounded-full w-4 h-4 flex items-center justify-center font-medium"
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}