import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a new Supabase client for each request (serverless-friendly)
function getSupabase(): SupabaseClient | null {
  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });
    return null;
  }

  if (!supabaseUrl.startsWith("http")) {
    console.error("Invalid Supabase URL:", supabaseUrl);
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Don't persist sessions in serverless
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
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

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  items: OrderItem[];
  shipping_fee: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getProducts(): Promise<Product[]> {
  const client = getSupabase();
  if (!client) {
    console.error("getProducts: Supabase client not available");
    return [];
  }

  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    throw error;
  }
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
  if (!client) {
    const errorMsg = "Supabase not configured - missing environment variables";
    console.error("createProduct error:", errorMsg);
    throw new Error(errorMsg);
  }

  console.log("Creating product:", { name: product.name, category: product.category });

  const { data, error } = await client
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("createProduct database error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }

  console.log("Product created successfully:", data.id);
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

// Order functions
export async function getOrders(): Promise<Order[]> {
  const client = getSupabase();
  if (!client) {
    console.error("getOrders: Supabase client not available");
    return [];
  }

  const { data, error } = await client
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders error:", error);
    throw error;
  }
  return data as Order[];
}

export async function createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">) {
  const client = getSupabase();
  if (!client) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await client
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) {
    console.error("createOrder error:", error);
    throw error;
  }
  return data as Order;
}

export async function updateOrder(id: string, order: Partial<Order>) {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client
    .from("orders")
    .update({ ...order, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function deleteOrder(id: string) {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const { error } = await client.from("orders").delete().eq("id", id);
  if (error) throw error;
}

// Storage functions
export async function uploadProductImage(file: File): Promise<string> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await client.storage
    .from("products")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = client.storage.from("products").getPublicUrl(fileName);
  return data.publicUrl;
}
