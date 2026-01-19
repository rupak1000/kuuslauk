import { NextRequest, NextResponse } from "next/server";
import { sql, isDatabaseAvailable } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const body = await request.json();
    console.log("[ORDERS API] Received body:", JSON.stringify(body, null, 2));

    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      items, 
      total, 
      pickupTime, 
      paymentMethod, 
      notes 
    } = body;

    // Required fields validation
    if (!customerName || !pickupTime || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields (name, pickupTime, paymentMethod)" }, { status: 400 });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Status: card → pending_payment (wait for confirmation), cash → pending
    const status = paymentMethod === "card" ? "pending_payment" : "pending";

    // Safe total
    const safeTotal = Number(total) || 0;

    // 1. Insert main order
    const [order] = await sql`
      INSERT INTO orders (
        order_number, 
        customer_name, 
        customer_phone, 
        customer_email, 
        total, 
        pickup_time, 
        payment_method, 
        notes,
        status
      ) VALUES (
        ${orderNumber}, 
        ${customerName}, 
        ${customerPhone || null}, 
        ${customerEmail || null}, 
        ${safeTotal}, 
        ${pickupTime}, 
        ${paymentMethod}, 
        ${notes || null},
        ${status}
      )
      RETURNING id, order_number
    `;

    console.log("[ORDERS API] Order created:", { 
      id: order.id, 
      order_number: order.order_number, 
      status 
    });

    // 2. Insert order items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const finalName = item.name || item.name_en || item.name_et || item.name_ru || "Menu Item";
        const menuItemId = item.id && !isNaN(Number(item.id)) ? Number(item.id) : null;

        await sql`
          INSERT INTO order_items (
            order_id,
            menu_item_id,
            item_name,
            quantity,
            price,
            protein_choice,
            special_notes
          ) VALUES (
            ${order.id},
            ${menuItemId},
            ${finalName},
            ${Number(item.quantity) || 1},
            ${Number(item.price) || 0},
            ${item.proteinChoice || null},
            ${item.notes || null}
          )
        `;
      }
      console.log("[ORDERS API] Inserted", items.length, "order items");
    } else {
      console.log("[ORDERS API] No items received");
    }

    // 3. Send notification only for cash / pending orders
    if (status === "pending") {
      const origin = request.nextUrl.origin;
      const notifyUrl = `${origin}/api/notifications/admin`;

      console.log("[ORDERS API] Sending notification for cash order to:", notifyUrl);

      fetch(notifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { 
            orderNumber, 
            customerName, 
            customerPhone, 
            customerEmail, 
            items, 
            total: safeTotal, 
            pickupTime, 
            paymentMethod, 
            notes,
            orderId: order.id
          }
        })
      }).catch(err => console.error("[ORDERS API] Notification trigger failed:", err));
    } else {
      console.log("[ORDERS API] Card payment → notification delayed until confirmation");
    }

    // Success response
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number
    }, { status: 201 });

  } catch (error: any) {
    console.error("[ORDERS API] CRITICAL ERROR:", {
      message: error.message,
      code: error.code,
      detail: error.detail || error.hint,
      stack: error.stack?.split('\n').slice(0, 5)
    });

    return NextResponse.json(
      { error: "Failed to place order", detail: error.message || "Unknown database error" },
      { status: 500 }
    );
  }
}