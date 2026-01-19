import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql, isDatabaseAvailable } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ⚠️ DEV fallback only – remove in production
    if (!isDatabaseAvailable() || !sql) {
      if (
        email.toLowerCase() === "admin@kuuslauk.ee" &&
        password === "kuuslauk2024"
      ) {
        return NextResponse.json({
          success: true,
          admin: {
            id: "1",
            email: "admin@kuuslauk.ee",
            name: "Admin",
          },
        });
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Fetch admin
    const result = await sql`
      SELECT id, email, name, password_hash
      FROM admin_users
      WHERE email = ${email.toLowerCase()}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const admin = result[0];

    // Verify password
    const valid = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ CORRECT way to set cookies
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id.toString(),
        email: admin.email,
        name: admin.name,
      },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
