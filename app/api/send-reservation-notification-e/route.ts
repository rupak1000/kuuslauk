import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { reservation, type } = await request.json();

    const menuLabels: Record<string, string> = {
      regular: "Regular Menu",
      "full-course": "Full Course Menu (€21)",
      kids: "Kids Menu",
    };

    const formattedDate = new Date(reservation.date).toLocaleDateString("et-EE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Determine if this is an Admin Alert or a Customer Confirmation
    const isConfirmation = type === "CONFIRMATION";
    
    const subject = isConfirmation 
      ? `Reservation Confirmed: Küüslauk Restaurant` 
      : `New Table Reservation - ${reservation.name}`;

    const toEmail = isConfirmation 
      ? reservation.email 
      : "rupakbd2021@gmail.com";

    const { data, error } = await resend.emails.send({
      from: "Küüslauk Restaurant <rupakbd2011@gmail.com>",
      to: [toEmail],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e11d48; margin-top: 0;">
            ${isConfirmation ? "Booking Confirmed!" : "New Table Reservation"}
          </h2>
          <p>Hello ${reservation.name},</p>
          <p>${isConfirmation 
            ? "Your table has been officially confirmed. We look forward to seeing you!" 
            : "A new reservation has been placed on the website."}</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <ul style="list-style: none; padding-left: 0;">
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${reservation.time}</li>
            <li><strong>Guests:</strong> ${reservation.guests}</li>
            <li><strong>Menu:</strong> ${reservation.menu ? menuLabels[reservation.menu] || reservation.menu : "Standard"}</li>
          </ul>

          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Reservation ID: #${reservation.id} | Status: ${reservation.status.toUpperCase()}
          </p>
        </div>
      `,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}