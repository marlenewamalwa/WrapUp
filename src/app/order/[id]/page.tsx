import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function OrderConfirmedPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "var(--green-pale)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            marginBottom: "2rem",
          }}
        >
          ✓
        </div>

        <p
          style={{
            color: "var(--green-mid)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            fontFamily: "'DM Sans', sans-serif",
          }}
          className="uppercase mb-2"
        >
          Order received
        </p>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-dark)",
            fontWeight: 600,
          }}
          className="mb-4"
        >
          {order?.customer_name ? `Thank you, ${order.customer_name.split(" ")[0]}!` : "Order Confirmed!"}
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.95rem",
            lineHeight: 1.7,
            maxWidth: 360,
          }}
          className="mb-10"
        >
          Your wrap is being prepared. We'll send you an SMS when it's ready.
        </p>

        {order && (
          <div
            style={{
              backgroundColor: "var(--warm-white)",
              border: "1px solid #e8e4dc",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              textAlign: "left",
            }}
            className="mb-10"
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--text-dark)",
              }}
              className="mb-4"
            >
              Order Summary
            </h2>

            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between mb-2"
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
              className="flex justify-between pt-4 mt-3"
              style={{ borderTop: "1px solid #e8e4dc" }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--text-dark)",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--green-deep)",
                }}
              >
                KSh {order.total.toLocaleString()}
              </span>
            </div>

            <div
              className="mt-4 pt-4"
              style={{
                borderTop: "1px solid #e8e4dc",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "var(--text-muted)",
              }}
            >
              <p>Phone: {order.phone}</p>
              <p className="mt-1">
                Status:{" "}
                <span
                  style={{ color: "var(--green-mid)", fontWeight: 500 }}
                  className="capitalize"
                >
                  {order.status.replace("_", " ")}
                </span>
              </p>
              {order.mpesa_ref && (
                <p className="mt-1">M-Pesa Ref: {order.mpesa_ref}</p>
              )}
            </div>
          </div>
        )}

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
          className="uppercase px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
        >
          Order Again
        </Link>
      </div>
    </main>
  );
}