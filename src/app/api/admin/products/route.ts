import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createProduct, getProducts, updateProduct, deleteProduct } from "@/lib/supabase";

const SESSION_NAME = "peppory_admin_session";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_NAME)?.value === "authenticated";
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("POST /api/admin/products - Request body:", body);

    const product = await createProduct(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/admin/products - Error:", error);

    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "Failed to create product";
    const errorDetails = error instanceof Error && 'code' in error
      ? { code: (error as any).code, details: (error as any).details }
      : {};

    return NextResponse.json({
      error: errorMessage,
      ...errorDetails
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await request.json();
    const product = await updateProduct(id, data);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
