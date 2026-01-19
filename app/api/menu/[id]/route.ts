import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

/**
 * Shared helper to map DB row to Frontend structure
 */
const mapMenuItem = (item: any) => ({
  id: item.id.toString(),
  name: { 
    en: item.name_en, 
    et: item.name_et || "", 
    ru: item.name_ru || "" 
  },
  description: item.description_en
    ? {
        en: item.description_en,
        et: item.description_et || "",
        ru: item.description_ru || "",
      }
    : undefined,
  price: Number.parseFloat(item.price),
  category: item.category_slug,
  image: item.image_url || "",
  spicy: item.is_spicy,
  extraSpicy: item.is_extra_spicy,
  vegan: item.is_vegan,
  isActive: item.is_active,
  sortOrder: item.sort_order,
})

// GET - Fetch single menu item
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM menu_items WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(mapMenuItem(result[0]))
  } catch (error) {
    console.error("Failed to fetch menu item:", error)
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 })
  }
}

// PUT - Update menu item
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params;
    const body = await request.json()
    
    const { 
      name, 
      description, 
      price, 
      category, 
      image, 
      spicy, 
      extraSpicy, 
      vegan, 
      isActive, 
      sortOrder 
    } = body

    // We use explicit values here to allow updating optional fields to null/empty strings
    const result = await sql`
      UPDATE menu_items SET
        name_en = ${name?.en || null},
        name_et = ${name?.et || null},
        name_ru = ${name?.ru || null},
        description_en = ${description?.en || null},
        description_et = ${description?.et || null},
        description_ru = ${description?.ru || null},
        price = ${price},
        category_slug = ${category},
        image_url = ${image || null},
        is_spicy = ${spicy ?? false},
        is_extra_spicy = ${extraSpicy ?? false},
        is_vegan = ${vegan ?? false},
        is_active = ${isActive ?? true},
        sort_order = ${sortOrder ?? 0},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(mapMenuItem(result[0]))
  } catch (error) {
    console.error("Failed to update menu item:", error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

// DELETE - Delete menu item
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Execute deletion
    const result = await sql`
      DELETE FROM menu_items 
      WHERE id = ${id} 
      RETURNING id
    `

    if (result.length === 0) {
      // This means the ID sent didn't match any row
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error("DELETE API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}