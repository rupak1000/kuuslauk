import { NextRequest, NextResponse } from "next/server";
import { sql, isDatabaseAvailable } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const body = await request.json();
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

    // Generate Order Number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 1. Insert into 'orders' table
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
        ${customerPhone}, 
        ${customerEmail}, 
        ${total}, 
        ${pickupTime}, 
        ${paymentMethod}, 
        ${notes || null},
        'pending'
      )
      RETURNING id
    `;

    // 2. Insert into 'order_items' table
    for (const item of items) {
      // Ensure item_name is NEVER null by checking all possible name properties
      const finalName = item.name || item.name_en || item.name_et || item.name_ru || "Menu Item";
      
      // Ensure ID is a valid number for the INT column
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
          ${item.quantity || 1},
          ${item.price || 0},
          ${item.proteinChoice || null},
          ${item.notes || null}
        )
      `;
    }

    // 3. Trigger Admin Notification (Background)
    const origin = request.nextUrl.origin;
    fetch(`${origin}/api/notifications/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: { orderNumber, customerName, customerPhone, customerEmail, items, total, pickupTime, paymentMethod, notes }
      })
    }).catch(err => console.error("Notification trigger failed:", err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber
    }, { status: 201 });

  } catch (error: any) {
    console.error("Detailed Database Error:", error);
    return NextResponse.json(
      { error: "Failed to place order", detail: error.message },
      { status: 500 }
    );
  }
}