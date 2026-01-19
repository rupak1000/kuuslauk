import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

export async function GET(request: NextRequest) {
  // 1. Connection Guard
  if (!isDatabaseAvailable() || !sql) {
    console.error("Database connection missing in GET /api/offers")
    return NextResponse.json([], { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"
    const type = searchParams.get("type")

    let offers = []
    const today = new Date().toISOString().split("T")[0]

    // 2. Optimized Query Logic
    if (activeOnly) {
      if (type) {
        offers = await sql`
          SELECT * FROM offers 
          WHERE is_active = true 
          AND valid_from <= ${today} 
          AND valid_until >= ${today}
          AND offer_type = ${type}
          ORDER BY id DESC
        `
      } else {
        offers = await sql`
          SELECT * FROM offers 
          WHERE is_active = true 
          AND valid_from <= ${today} 
          AND valid_until >= ${today}
          ORDER BY id DESC
        `
      }
    } else if (type) {
      offers = await sql`SELECT * FROM offers WHERE offer_type = ${type} ORDER BY id DESC`
    } else {
      offers = await sql`SELECT * FROM offers ORDER BY id DESC`
    }

    // 3. Transformation with explicit fallback and Date handling
    const transformedOffers = offers.map((offer: any) => ({
      id: offer.id.toString(),
      title: {
        en: offer.title_en || "",
        et: offer.title_et || "",
        ru: offer.title_ru || "",
      },
      description: {
        en: offer.description_en || "",
        et: offer.description_et || "",
        ru: offer.description_ru || "",
      },
      // Ensure numeric types
      originalPrice: Number(offer.original_price) || 0,
      discountPrice: Number(offer.discount_price) || 0,
      type: offer.offer_type,
      // Format dates to YYYY-MM-DD string for HTML input compatibility
      validFrom: offer.valid_from instanceof Date 
        ? offer.valid_from.toISOString().split('T')[0] 
        : offer.valid_from,
      validUntil: offer.valid_until instanceof Date 
        ? offer.valid_until.toISOString().split('T')[0] 
        : offer.valid_until,
      image: offer.image_url || "",
      isActive: Boolean(offer.is_active),
    }))

    return NextResponse.json(transformedOffers)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const body = await request.json()
    // Destructure with defaults
    const { 
      title = {}, 
      description = {}, 
      originalPrice = 0, 
      discountPrice = 0, 
      type = "daily", 
      validFrom, 
      validUntil, 
      image = "", 
      isActive = true 
    } = body

    const result = await sql`
      INSERT INTO offers (
        title_en, title_et, title_ru,
        description_en, description_et, description_ru,
        original_price, discount_price, offer_type,
        valid_from, valid_until, image_url, is_active,
        created_at, updated_at
      ) VALUES (
        ${title.en || ""}, ${title.et || ""}, ${title.ru || ""},
        ${description.en || ""}, ${description.et || ""}, ${description.ru || ""},
        ${originalPrice}, ${discountPrice}, ${type},
        ${validFrom}, ${validUntil}, ${image}, ${isActive},
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `

    const offer = result[0]
    
    // Return the same structure as GET for immediate UI updates
    return NextResponse.json({
      id: offer.id.toString(),
      title: { en: offer.title_en, et: offer.title_et, ru: offer.title_ru },
      description: { en: offer.description_en, et: offer.description_et, ru: offer.description_ru },
      originalPrice: Number(offer.original_price),
      discountPrice: Number(offer.discount_price),
      type: offer.offer_type,
      validFrom: offer.valid_from instanceof Date ? offer.valid_from.toISOString().split('T')[0] : offer.valid_from,
      validUntil: offer.valid_until instanceof Date ? offer.valid_until.toISOString().split('T')[0] : offer.valid_until,
      image: offer.image_url || "",
      isActive: offer.is_active,
    }, { status: 201 })

  } catch (error) {
    console.error("Create Error:", error)
    return NextResponse.json({ error: "Check console for details" }, { status: 500 })
  }
}