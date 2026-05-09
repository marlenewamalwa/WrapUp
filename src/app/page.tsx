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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Fresh Wraps, Made for You</h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto">
          Order your favourite wrap and we'll have it ready in minutes.
        </p>
      </section>

      {/* Menu */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Our Menu</h2>
        {menuItems.length === 0 ? (
          <p className="text-gray-500 text-center py-20">
            No items available right now. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <WrapCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}