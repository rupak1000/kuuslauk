import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  proteinChoice?: string;
  notes?: string;
}

interface AdminNotificationRequest {
  // adminEmail is now optional — we read from env
  adminEmail?: string;
  order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    pickupTime: string;
    paymentMethod: "card" | "cash";
    notes?: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: AdminNotificationRequest = await request.json();
    const { order } = body;

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL not set in environment variables");
      return NextResponse.json(
        { success: false, error: "Server email configuration missing" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Format items for plain-text fallback
    const itemsList = order.items
      .map((item) => {
        let line = `  - ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})`;
        if (item.proteinChoice) line += ` [${item.proteinChoice}]`;
        if (item.notes) line += ` Note: "${item.notes}"`;
        return line;
      })
      .join("\n");

    const plainText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW ORDER RECEIVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: ${order.orderNumber}
Total: €${order.total.toFixed(2)}

📋 CUSTOMER DETAILS:
  Name: ${order.customerName}
  Phone: ${order.customerPhone}
  Email: ${order.customerEmail}

🍽️ ORDER ITEMS:
${itemsList}

⏰ Pickup Time: ${order.pickupTime}
💳 Payment: ${order.paymentMethod === "card" ? "Online Payment" : "Pay on Arrival"}
${order.notes ? `📝 Notes: "${order.notes}"` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please prepare the order in time!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const { data, error } = await resend.emails.send({
      from: "KÜÜSLAUK WOK & KEBAB <onboarding@resend.dev>", // ← Option 1: Resend's pre-verified shared address
      to: [adminEmail],
      subject: `🔔 New Order #${order.orderNumber} – €${order.total.toFixed(2)}`,
      text: plainText.trim(),
      // Optional: add react: <AdminOrderEmail order={order} /> when you create template
    });

    if (error) {
      console.error("Resend failed:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Admin notification sent successfully:", data?.id);

    return NextResponse.json({
      success: true,
      message: "Admin notification sent",
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Failed to process admin notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}