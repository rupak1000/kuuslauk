import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

// GET - Fetch site settings
export async function GET() {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({
      logo: "",
      restaurantName: "KÜÜSLAUK",
      address: "Sadama tn 7, 10111 Tallinn",
      phone: "5424 0020",
      email: "info@kuuslauk.ee",
      mapLink: "https://maps.app.goo.gl/MC6A1CWw34dXzTsk9",
    })
  }

  try {
    const result = await sql`SELECT * FROM site_settings WHERE id = 1`

    if (result.length === 0) {
      return NextResponse.json({
        logo: "",
        restaurantName: "KÜÜSLAUK",
        address: "Sadama tn 7, 10111 Tallinn",
        phone: "5424 0020",
        email: "info@kuuslauk.ee",
        mapLink: "https://maps.app.goo.gl/MC6A1CWw34dXzTsk9",
      })
    }

    const settings = result[0]
    return NextResponse.json({
      logo: settings.logo_url || "",
      restaurantName: settings.restaurant_name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      mapLink: settings.map_link,
    })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { logo, restaurantName, address, phone, email, mapLink } = body

    // Use COALESCE to keep existing values if the update is partial
    const result = await sql`
      INSERT INTO site_settings (id, logo_url, restaurant_name, address, phone, email, map_link)
      VALUES (1, ${logo || null}, ${restaurantName || "KÜÜSLAUK"}, ${address || null}, ${phone || null}, ${email || null}, ${mapLink || null})
      ON CONFLICT (id) DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        restaurant_name = EXCLUDED.restaurant_name,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        map_link = EXCLUDED.map_link,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    const settings = result[0]
    return NextResponse.json({
      logo: settings.logo_url || "",
      restaurantName: settings.restaurant_name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      mapLink: settings.map_link,
    })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}