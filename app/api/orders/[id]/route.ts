import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql, isDatabaseAvailable } from "@/lib/db";

// 🔐 Admin auth helper
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// GET - Fetch single order with its items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
  }

  try {
    const { id } = await params;

    const orderResult = await sql`SELECT * FROM orders WHERE id = ${id}`;

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderResult[0];

    // Fetch the items belonging to this order
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${order.id}`;

    // Return format matches exactly what OrderCard expects
    return NextResponse.json({
      id: order.id.toString(),
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      total: Number.parseFloat(order.total),
      pickupTime: order.pickup_time,
      paymentMethod: order.payment_method,
      notes: order.notes,
      status: order.status,
      createdAt: order.created_at,
      items: items.map((item: any) => ({
        id: item.menu_item_id?.toString() || item.id.toString(),
        quantity: item.quantity,
        proteinChoice: item.protein_choice,
        notes: item.special_notes,
        // Wrap in menuItem to prevent the "map" crash in the frontend
        menuItem: {
          name: { en: item.item_name, et: item.item_name, ru: item.item_name },
          price: Number.parseFloat(item.price)
        }
      })),
    });
  } catch (error) {
    console.error("GET order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update order status (Handles "preparing", "ready", etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    const result = await sql`
      UPDATE orders SET
        status = ${status},
        notified_at = ${status === 'ready' ? sql`CURRENT_TIMESTAMP` : sql`notified_at`},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...result[0],
        id: result[0].id.toString(),
        total: Number.parseFloat(result[0].total)
      }
    });
  } catch (error) {
    console.error("PUT update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE - Delete order from database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM orders WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}