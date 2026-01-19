import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// 1. GET METHOD: Fixes the 405 Error in the Admin Panel
export async function GET() {
  try {
    if (!isDatabaseAvailable() || !sql) {
      return NextResponse.json([]) 
    }

    const reservations = await sql`
      SELECT * FROM reservations 
      ORDER BY created_at DESC
    `

    // Format IDs to strings for the React Frontend
    const formatted = (reservations || []).map(r => ({
      ...r,
      id: r.id.toString(),
      createdAt: r.created_at
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json([], { status: 500 }) 
  }
}

// 2. POST METHOD: Handles the booking and prevents double-entry
export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const data = await request.json()
    const { name, email, phone, date, time, guests, menu, notes } = data

    // Safety: Ensure we don't insert empty rows
    if (!name || !email || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert into Neon
    const [reservation] = await sql`
      INSERT INTO reservations (
        name, email, phone, date, time, guests, menu, notes, status
      ) VALUES (
        ${name}, ${email}, ${phone}, ${date}, ${time}, 
        ${Number.parseInt(guests) || 1}, ${menu || null}, ${notes || null}, 'pending'
      )
      RETURNING *
    `

    // Email Labels
    const menuLabels: Record<string, string> = {
      regular: "Regular Menu",
      "full-course": "Full Course Menu (€21)",
      kids: "Kids Menu",
    }

    // Send Email via Resend (Non-blocking)
    if (process.env.RESEND_API_KEY) {
      const adminEmail = process.env.ADMIN_EMAIL || "rupakbd2011@gmail.com"
      resend.emails.send({
        from: "Küüslauk Wok & Kebab <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 NEW RESERVATION # ${name}`,
        html: `
         <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">

  <!-- Header -->
  <div style="background-color: #e11d48; padding: 16px 20px;">
    <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
      New Table Reservation
    </h2>
  </div>

  <!-- Content -->
  <div style="padding: 20px; font-size: 14px;">
    <p style="margin: 0 0 16px 0; color: #374151;">
      A new reservation has been received with the following details:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Customer</td>
        <td style="padding: 8px 0; font-weight: 600; color: #111827;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Phone</td>
        <td style="padding: 8px 0; font-weight: 600; color: #111827;">${phone}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Date & Time</td>
        <td style="padding: 8px 0; font-weight: 600; color: #111827;">${date} at ${time}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Guests</td>
        <td style="padding: 8px 0; font-weight: 600; color: #111827;">${guests}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Menu</td>
        <td style="padding: 8px 0; font-weight: 600; color: #111827;">
          ${menu ? menuLabels[menu] || menu : "Not specified"}
        </td>
      </tr>
    </table>

    ${notes ? `
      <div style="margin-top: 16px; padding: 12px; background-color: #f9fafb; border-left: 4px solid #e11d48; border-radius: 6px; color: #374151;">
        <strong style="display: block; margin-bottom: 4px;">Notes</strong>
        ${notes}
      </div>
    ` : ""}

  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 12px 20px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb;">
    Reservation ID: <strong style="color: #111827;">#${reservation.id}</strong>
  </div>

</div>

        `,
      }).catch(err => console.error("Email Error:", err))
    }

    // Return success + the object so the frontend updates immediately
    return NextResponse.json({
      success: true,
      reservation: {
        ...reservation,
        id: reservation.id.toString(),
        createdAt: reservation.created_at
      }
    })

  } catch (error: any) {
    console.error("POST Error:", error)
    return NextResponse.json({ success: false, detail: error.message }, { status: 500 })
  }
}