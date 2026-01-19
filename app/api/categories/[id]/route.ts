import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const result = await sql`SELECT * FROM categories WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const cat = result[0]
    return NextResponse.json({
      id: cat.id.toString(),
      slug: cat.slug,
      name: { en: cat.name_en, et: cat.name_et, ru: cat.name_ru },
      sortOrder: cat.sort_order,
    })
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { slug, name, sortOrder, isActive } = body

    const result = await sql`
      UPDATE categories SET
        slug = COALESCE(${slug}, slug),
        name_en = COALESCE(${name?.en}, name_en),
        name_et = COALESCE(${name?.et}, name_et),
        name_ru = COALESCE(${name?.ru}, name_ru),
        sort_order = COALESCE(${sortOrder}, sort_order),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const cat = result[0]
    return NextResponse.json({
      id: cat.id.toString(),
      slug: cat.slug,
      name: { en: cat.name_en, et: cat.name_et, ru: cat.name_ru },
      sortOrder: cat.sort_order,
    })
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params
    const result = await sql`DELETE FROM categories WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
