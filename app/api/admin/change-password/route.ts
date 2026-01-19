import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"
import bcrypt from "bcryptjs"

// POST - Change admin password
export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { email, currentPassword, newPassword } = body

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Find admin user
    const result = await sql`
      SELECT * FROM admin_users WHERE email = ${email.toLowerCase()}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const admin = result[0]

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await sql`
      UPDATE admin_users SET
        password_hash = ${newPasswordHash},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to change password:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
