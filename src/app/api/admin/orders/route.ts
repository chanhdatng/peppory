import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder, getOrders, updateOrder, deleteOrder } from "@/lib/supabase";

const SESSION_NAME = "peppory_admin_session";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_NAME)?.value === "authenticated";
}

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (error) {
    console.error("POST order error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await request.json();
    const order = await updateOrder(id, data);
    return NextResponse.json(order);
  } catch (error) {
    console.error("PUT order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await deleteOrder(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE order error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
