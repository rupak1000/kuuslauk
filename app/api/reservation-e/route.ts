import { NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  // Check if database is connected
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const data = await request.json()
    const { name, email, phone, date, time, guests, menu, notes } = data

    // 1. Insert into your specific Neon "reservations" table
    // Using the exact column names from your schema
    const [reservation] = await sql`
      INSERT INTO reservations (
        name, 
        email, 
        phone, 
        date, 
        time, 
        guests, 
        menu, 
        notes,
        status
      ) VALUES (
        ${name}, 
        ${email}, 
        ${phone}, 
        ${date}, 
        ${time}, 
        ${Number.parseInt(guests) || 1}, 
        ${menu || null}, 
        ${notes || null},
        'pending'
      )
      RETURNING id
    `

    // 2. Format the labels for the email notification
    const menuLabels: Record<string, string> = {
      regular: "Regular Menu",
      "full-course": "Full Course Menu (€21)",
      kids: "Kids Menu",
    }

    const formattedDate = new Date(date).toLocaleDateString("et-EE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // 3. Send Email via Resend
    // Replace 'onboarding@resend.dev' with your verified domain email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Küüslauk Restaurant <rupakbd2011@gmail.com>",
        to: ["rupakbd2011@gmail.com"], // Where the restaurant gets notified
        subject: `New Table Reservation - ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #e11d48; margin-top: 0;">New Table Reservation</h2>
            <p><strong>Customer Details:</strong></p>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
            </ul>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p><strong>Reservation Details:</strong></p>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Date:</strong> ${formattedDate}</li>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Number of Guests:</strong> ${guests}</li>
              <li><strong>Preferred Menu:</strong> ${menu ? menuLabels[menu] || menu : "Not specified"}</li>
            </ul>

            ${notes ? `<p><strong>Additional Notes:</strong><br/>${notes}</p>` : ""}
            
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              Reservation ID: #${reservation.id} | Status: Pending
            </p>
          </div>
        `,
      }).catch(err => console.error("Email notification failed to send:", err))
    }

    // 4. Return success with the database ID
    return NextResponse.json({
      success: true,
      id: reservation.id,
      message: "Reservation saved and notification sent",
    })

  } catch (error: any) {
    console.error("Reservation API error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process reservation", 
        detail: error.message 
      }, 
      { status: 500 }
    )
  }
}