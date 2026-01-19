import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, name, resetUrl } = await request.json()

    // Log the reset email for now
    console.log("=== PASSWORD RESET EMAIL ===")
    console.log(`To: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log("============================")

    // In production, integrate with an email service like Resend, SendGrid, etc.
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'Kuuslauk <noreply@kuuslauk.ee>',
      to: email,
      subject: 'Reset Your Password - Kuuslauk Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d97706;">Password Reset Request</h1>
          <p>Hello ${name || 'Admin'},</p>
          <p>You requested to reset your password for Kuuslauk Admin Dashboard.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">
            Kuuslauk Restaurant<br/>
            Sadama tn 7, 10111 Tallinn<br/>
            Phone: 5424 0020
          </p>
        </div>
      `
    })
    */

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send reset email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
