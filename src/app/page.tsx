import WrapCard from "@/components/WrapCard";
import Navbar from "@/components/Navbar";
import { supabase, MenuItem } from "@/lib/supabase";

async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const menuItems = await getMenuItems();

  const categories = [...new Set(menuItems.map((i) => i.category))];

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
   {/* Hero */}
<section
  style={{ backgroundColor: "var(--green-deep)", position: "relative", overflow: "hidden" }}
>
  {/* Background image */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: "url('https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1400&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.2,
    }}
  />

  <div className="max-w-6xl mx-auto px-6 py-28 flex flex-col items-start" style={{ position: "relative", zIndex: 1 }}>
    <p
      style={{
        color: "var(--green-light)",
        fontSize: "0.75rem",
        letterSpacing: "0.2em",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className="uppercase mb-6"
    >
      Fresh · Handcrafted · Nairobi
    </p>
    <h1
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(3rem, 8vw, 6rem)",
        fontWeight: 600,
        color: "var(--warm-white)",
        lineHeight: 1.05,
        letterSpacing: "-0.01em",
      }}
    >
      Wraps worth
      <br />
      <em style={{ color: "var(--green-light)" }}>savouring.</em>
    </h1>
    <p
      style={{
        color: "#a8c5b0",
        fontSize: "1rem",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        maxWidth: 420,
        lineHeight: 1.7,
      }}
      className="mt-6 mb-10"
    >
      Every wrap made to order, with ingredients that actually matter.
      Pick up or get it delivered.
    </p>
    <a
      href="#menu"
      style={{
        backgroundColor: "var(--warm-white)",
        color: "var(--green-deep)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.85rem",
        letterSpacing: "0.08em",
        fontWeight: 500,
      }}
      className="uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
    >
      View Menu
    </a>
  </div>

  {/* Decorative circles */}
  <div style={{ position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(149, 213, 178, 0.15)", pointerEvents: "none", zIndex: 1 }} />
  <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", width: "350px", height: "350px", borderRadius: "50%", border: "1px solid rgba(149, 213, 178, 0.1)", pointerEvents: "none", zIndex: 1 }} />
</section>

      {/* Menu */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              style={{
                color: "var(--green-mid)",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                fontFamily: "'DM Sans', sans-serif",
              }}
              className="uppercase mb-2"
            >
              What we make
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--text-dark)",
                fontWeight: 600,
              }}
            >
              Our Menu
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {menuItems.length} items
          </p>
        </div>

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                style={{
                  border: "1px solid #d4cfc6",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: "var(--warm-white)",
                }}
                className="uppercase px-4 py-1.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {menuItems.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }} className="text-center py-20">
            No items available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <WrapCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e8e4dc",
          backgroundColor: "var(--warm-white)",
        }}
        className="py-10"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              color: "var(--green-deep)",
            }}
          >
            WrapUp
          </span>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            © 2026 WrapUp. Nairobi, Kenya.
          </p>
        </div>
      </footer>
    </main>
  );
}