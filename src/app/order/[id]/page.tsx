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
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 max-w-md mb-6">
          Thanks {order?.customer_name}! Your wrap is being prepared.
        </p>

        {order && (
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md text-left mb-8">
            <h2 className="font-semibold text-gray-800 mb-4">Order Details</h2>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{item.name} × {item.quantity}</span>
                <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>KSh {order.total.toLocaleString()}</span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Phone: {order.phone}</p>
              <p>Status: <span className="text-green-600 font-medium capitalize">{order.status}</span></p>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Order Again
        </Link>
      </div>
    </main>
  );
}