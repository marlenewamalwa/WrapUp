import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "ready" | "delivered";
  mpesa_ref?: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};