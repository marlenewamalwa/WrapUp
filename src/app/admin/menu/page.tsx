"use client";

import { useEffect, useState } from "react";
import { supabase, MenuItem } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  available: true,
};

export default function AdminMenuPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const fetchItems = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    fetchItems();
  }, [authed]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    setForm({
      ...form,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required.");
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      image_url: form.image_url,
      available: form.available,
    };

    if (editing) {
      await supabase.from("menu_items").update(payload).eq("id", editing);
    } else {
      await supabase.from("menu_items").insert(payload);
    }

    setForm(emptyForm);
    setEditing(null);
    setSaving(false);
    fetchItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url,
      available: item.available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    fetchItems();
  };

  const toggleAvailable = async (id: string, available: boolean) => {
    await supabase.from("menu_items").update({ available }).eq("id", id);
    fetchItems();
  };

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-red-400 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editing ? "Edit Item" : "Add New Item"}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Chicken Tikka Wrap"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Price (KSh)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 450"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the wrap..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Chicken, Veggie, Beef"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Image URL (optional)</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                id="available"
                checked={form.available}
                onChange={handleChange}
                className="w-4 h-4 accent-green-600"
              />
              <label htmlFor="available" className="text-sm text-gray-600">
                Available on menu
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Item" : "Add Item"}
              </button>
              {editing && (
                <button
                  onClick={() => { setEditing(null); setForm(emptyForm); }}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Menu</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.available ? "Available" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{item.category} · KSh {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailable(item.id, !item.available)}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-50 transition"
                  >
                    {item.available ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs border border-blue-200 px-3 py-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs border border-red-200 px-3 py-1.5 rounded-full text-red-500 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}