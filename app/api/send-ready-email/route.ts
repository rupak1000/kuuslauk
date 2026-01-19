import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ReadyEmailRequest {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  pickupTime: string;
  location: {
    address: string;
    phone: string;
    mapLink: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: ReadyEmailRequest = await request.json();
    const { customerEmail, customerName, orderNumber, pickupTime, location } = body;

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "Küüslauk Wok & Kebab. <onboarding@resend.dev>", // Replace with your domain in production
      to: customerEmail,
      subject: `Order ${orderNumber} is Ready for Pickup! 🍲`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #d97706;">Hello ${customerName}!</h2>
          <p style="font-size: 16px;">Great news! Your order <strong>${orderNumber}</strong> is now <strong>READY</strong> for pickup.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📍 Pickup Details</h3>
            <p><strong>Location:</strong> ${location.address}</p>
            <p><strong>Phone:</strong> ${location.phone}</p>
            <p><strong>Requested Pickup Time:</strong> ${pickupTime}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${location.mapLink}" style="background-color: #d97706; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open in Google Maps</a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">Please show this email or mention your order number when you arrive at the restaurant.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 14px; text-align: center;">Thank you for choosing <strong>Kuuslauk</strong>!</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Ready notification sent via Resend",
      id: data?.id
    });

  } catch (error) {
    console.error("Failed to send ready email:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}