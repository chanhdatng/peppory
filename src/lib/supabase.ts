import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create client if we have valid config
let supabase: SupabaseClient | null = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProducts(): Promise<Product[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client
    .from("products")
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const { error } = await client.from("products").delete().eq("id", id);

  if (error) throw error;
}
