import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

// Robust helper to transform database row to frontend JSON structure
const transformOffer = (offer: any) => ({
  id: offer.id.toString(),
  title: { 
    en: offer.title_en || "", 
    et: offer.title_et || "", 
    ru: offer.title_ru || "" 
  },
  description: { 
    en: offer.description_en || "", 
    et: offer.description_et || "", 
    ru: offer.description_ru || "" 
  },
  // Ensure we return Numbers, not strings
  originalPrice: Number(offer.original_price) || 0,
  discountPrice: Number(offer.discount_price) || 0,
  type: offer.offer_type,
  // Format dates to YYYY-MM-DD for HTML5 date inputs in the form
  validFrom: offer.valid_from instanceof Date 
    ? offer.valid_from.toISOString().split('T')[0] 
    : offer.valid_from,
  validUntil: offer.valid_until instanceof Date 
    ? offer.valid_until.toISOString().split('T')[0] 
    : offer.valid_until,
  image: offer.image_url || "",
  isActive: Boolean(offer.is_active),
})

// GET - Fetch single offer
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const result = await sql`SELECT * FROM offers WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(transformOffer(result[0]))
  } catch (error) {
    console.error("Failed to fetch offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

// PUT - Update offer
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, originalPrice, discountPrice, type, validFrom, validUntil, image, isActive } = body

    const result = await sql`
      UPDATE offers SET
        title_en = COALESCE(${title?.en}, title_en),
        title_et = COALESCE(${title?.et}, title_et),
        title_ru = COALESCE(${title?.ru}, title_ru),
        description_en = COALESCE(${description?.en}, description_en),
        description_et = COALESCE(${description?.et}, description_et),
        description_ru = COALESCE(${description?.ru}, description_ru),
        original_price = COALESCE(${originalPrice}, original_price),
        discount_price = COALESCE(${discountPrice}, discount_price),
        offer_type = COALESCE(${type}, offer_type),
        valid_from = COALESCE(${validFrom}, valid_from),
        valid_until = COALESCE(${validUntil}, valid_until),
        image_url = COALESCE(${image}, image_url),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(transformOffer(result[0]))
  } catch (error) {
    console.error("Failed to update offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

// DELETE - Delete offer
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const result = await sql`DELETE FROM offers WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}