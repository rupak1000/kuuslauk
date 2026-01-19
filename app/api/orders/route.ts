import { NextRequest, NextResponse } from "next/server";
import { sql, isDatabaseAvailable } from "@/lib/db";

// Force Next.js to always fetch fresh data for the Admin Dashboard
export const dynamic = 'force-dynamic';

/**
 * 1. GET METHOD: This is what allows the Admin Dashboard to see the orders
 */
export async function GET() {
  try {
    if (!isDatabaseAvailable() || !sql) {
      return NextResponse.json([]); // Return empty array if DB is down
    }

    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `;

    // Format for React Frontend (Convert BigInt ID and Decimal total)
    const formattedOrders = (orders || []).map(order => ({
      ...order,
      id: order.id.toString(), 
      total: Number(order.total),
      createdAt: order.created_at
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("[ORDERS GET API] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * 2. POST METHOD: Handles creating the order from the checkout page
 */
export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { 
      customerName, customerPhone, customerEmail, 
      items, total, pickupTime, paymentMethod, notes 
    } = body;

    if (!customerName || !pickupTime || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Status Logic: 
    // Card payments start as 'pending_payment'
    // Cash payments start as 'pending'
    const status = paymentMethod === "card" ? "pending_payment" : "pending";
    const safeTotal = Number(total) || 0;

    // Insert main order
    const [order] = await sql`
      INSERT INTO orders (
        order_number, customer_name, customer_phone, customer_email, 
        total, pickup_time, payment_method, notes, status
      ) VALUES (
        ${orderNumber}, ${customerName}, ${customerPhone || null}, ${customerEmail || null}, 
        ${safeTotal}, ${pickupTime}, ${paymentMethod}, ${notes || null}, ${status}
      )
      RETURNING *
    `;

    // Insert order items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const finalName = item.name || item.name_en || "Menu Item";
        const menuItemId = item.id && !isNaN(Number(item.id)) ? Number(item.id) : null;

        await sql`
          INSERT INTO order_items (
            order_id, menu_item_id, item_name, quantity, price, protein_choice, special_notes
          ) VALUES (
            ${order.id}, ${menuItemId}, ${finalName}, 
            ${Number(item.quantity) || 1}, ${Number(item.price) || 0}, 
            ${item.proteinChoice || null}, ${item.notes || null}
          )
        `;
      }
    }

    // Success response formatted for immediate UI update
    return NextResponse.json({
      success: true,
      order: {
        ...order,
        id: order.id.toString(),
        total: Number(order.total)
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("[ORDERS POST API] Error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}