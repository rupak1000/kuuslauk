import { NextRequest, NextResponse } from "next/server";
import { sql, isDatabaseAvailable } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isDatabaseAvailable() || !sql) {
      return NextResponse.json([]); 
    }

    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    if (orders.length === 0) return NextResponse.json([]);

    const allItems = await sql`SELECT * FROM order_items`;

    const formattedOrders = orders.map(order => {
      const itemsForThisOrder = allItems
        .filter((item: any) => item.order_id === order.id)
        .map((item: any) => ({
          id: item.id.toString(),
          quantity: item.quantity,
          price: Number(item.price),
          proteinChoice: item.protein_choice,
          notes: item.special_notes,
          // 🛠️ FIX: Wrap the name in a translation object to satisfy item.menuItem.name[language]
          menuItem: { 
            price: Number(item.price),
            name: {
              en: item.item_name, // Fallback for all languages to the name stored in DB
              et: item.item_name,
              ru: item.item_name
            }
          }
        }));

      return {
        ...order,
        id: order.id.toString(),
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        total: Number(order.total),
        pickupTime: order.pickup_time,
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
        items: itemsForThisOrder
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("[ORDERS GET API] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

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

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const status = paymentMethod === "card" ? "pending_payment" : "pending";
    const safeTotal = Number(total) || 0;

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

    const itemsForResponse = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        const finalName = item.name || item.menuItem?.name?.en || "Menu Item";
        
        await sql`
          INSERT INTO order_items (
            order_id, item_name, quantity, price, protein_choice, special_notes
          ) VALUES (
            ${order.id}, ${finalName}, ${item.quantity}, ${item.price}, 
            ${item.proteinChoice || null}, ${item.notes || null}
          )
        `;

        // 🛠️ FIX: Matching the response structure to avoid immediate UI crashes
        itemsForResponse.push({
          quantity: item.quantity,
          menuItem: {
            name: { en: finalName, et: finalName, ru: finalName },
            price: Number(item.price)
          }
        });
      }
    }

    // Trigger Email Notification (Non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://${request.headers.get('host')}`;
    fetch(`${baseUrl}/api/send-admin-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: { ...body, orderNumber, items: itemsForResponse }
      }),
    }).catch(e => console.error("Email error:", e));

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        id: order.id.toString(),
        items: itemsForResponse
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}