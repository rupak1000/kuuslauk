// app/api/reservations/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const id = params.id

  try {
    if (!id) {
      return NextResponse.json({ error: "Missing reservation ID" }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, confirmed, cancelled, completed" },
        { status: 400 }
      )
    }

    if (!isDatabaseAvailable() || !sql) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const result = await sql`
      UPDATE reservations
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    const reservation = result[0]

    // Optional: also send email on cancel
    if (status === "cancelled" && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Küüslauk Wok & Kebab <onboarding@resend.dev>",
          to: [reservation.email],
          subject: "Your Reservation Has Been Cancelled",
          html: `
            <div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px; max-width:500px;">
              <h2 style="color:#dc2626;">Reservation Cancelled</h2>
              <p>Hello ${reservation.name},</p>
              <p>Your reservation for ${reservation.guests} guests on ${reservation.date} at ${reservation.time} has been cancelled.</p>
              <p>If this was a mistake, please contact us.</p>
              <p>Best regards,<br>Küüslauk Team</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error("Cancel email failed:", emailErr)
      }
    }

    // Always send confirmation email when confirmed
    else if (status === "confirmed" && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Küüslauk Wok & Kebab <onboarding@resend.dev>",
          to: [reservation.email],
          subject: "Reservation Confirmed - Küüslauk",
          html: `
            <div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px; max-width:500px;">
              <h2 style="color:#16a34a;">Booking Confirmed!</h2>
              <p>Hello ${reservation.name},</p>
              <p>Your table for <strong>${reservation.guests} guests</strong> has been confirmed.</p>
              <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString("et-EE")}</p>
              <p><strong>Time:</strong> ${reservation.time}</p>
              <p>We look forward to seeing you at Sadama tn 7!</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error("Confirmation email failed:", emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      reservation: {
        ...reservation,
        id: String(reservation.id), // ensure string for frontend
      },
    })
  } catch (err: any) {
    console.error(`[PUT /api/reservations/${id}]`, err)
    return NextResponse.json(
      { error: err.message || "Failed to update reservation" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const id = params.id

  try {
    if (!id) {
      return NextResponse.json({ error: "Missing reservation ID" }, { status: 400 })
    }

    if (!isDatabaseAvailable() || !sql) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const result = await sql`
      DELETE FROM reservations
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Reservation deleted successfully",
      deletedId: String(id),
    })
  } catch (err: any) {
    console.error(`[DELETE /api/reservations/${id}]`, err)
    return NextResponse.json(
      { error: err.message || "Failed to delete reservation" },
      { status: 500 }
    )
  }
}