import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const sql = getDb()

    if (!sql) {
      // For demo purposes without database, just simulate success
      console.log(`[Forgot Password] Reset requested for: ${email}`)

      // In production, this would send an actual email
      // For now, we'll log and return success
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link will be sent.",
      })
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email, name FROM admin_users WHERE email = ${email}
    `

    if (users.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link will be sent.",
      })
    }

    const user = users[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database (you'd need to add these columns to admin_users table)
    await sql`
      UPDATE admin_users 
      SET reset_token = ${resetToken}, reset_token_expiry = ${resetTokenExpiry}
      WHERE id = ${user.id}
    `

    // In production, send email with reset link
    // For now, log the reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/reset-password?token=${resetToken}`

    console.log(`[Forgot Password] Reset link for ${email}: ${resetUrl}`)

    // Try to send email if email service is configured
    try {
      await fetch("/api/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          resetUrl,
        }),
      })
    } catch (emailError) {
      console.log("[Forgot Password] Email sending skipped (service not configured)")
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link will be sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
