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

// GET - Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔐 Auth check
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;

    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `;

    if (orderResult.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    const items = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id}
    `;

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
        name: item.item_name,
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
        proteinChoice: item.protein_choice,
        notes: item.special_notes,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔐 Auth check
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    let result;

    if (status === "ready") {
      result = await sql`
        UPDATE orders SET
          status = ${status},
          notified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      result = await sql`
        UPDATE orders SET
          status = ${status},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    }

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result[0].status,
    });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔐 Auth check
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM orders
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
