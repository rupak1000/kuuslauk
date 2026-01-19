import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

/**
 * Helper to map DB row to Frontend JSON structure
 * This handles the translation from snake_case (DB) to camelCase (Frontend)
 */
const mapMenuItem = (item: any) => ({
  id: item.id.toString(),
  name: {
    en: item.name_en,
    et: item.name_et,
    ru: item.name_ru,
  },
  description: item.description_en
    ? {
        en: item.description_en,
        et: item.description_et,
        ru: item.description_ru,
      }
    : undefined,
  price: Number.parseFloat(item.price),
  category: item.category_slug,
  image: item.image_url || "", // Maps DB image_url to frontend image
  spicy: item.is_spicy,
  extraSpicy: item.is_extra_spicy,
  vegan: item.is_vegan,
  isActive: item.is_active,
  sortOrder: item.sort_order,
})

// GET - Fetch all menu items or filter by category
export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json([])
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const activeOnly = searchParams.get("active") !== "false"

    let items;
    if (category) {
      items = await sql`
        SELECT * FROM menu_items 
        WHERE category_slug = ${category} 
        ${activeOnly ? sql`AND is_active = true` : sql``}
        ORDER BY sort_order ASC, id ASC
      `
    } else {
      items = await sql`
        SELECT * FROM menu_items 
        ${activeOnly ? sql`WHERE is_active = true` : sql``}
        ORDER BY category_slug, sort_order ASC, id ASC
      `
    }

    return NextResponse.json(items.map(mapMenuItem))
  } catch (error) {
    console.error("Failed to fetch menu items:", error)
    return NextResponse.json([])
  }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      category, 
      image, // This is the Cloudinary URL from your ImageUpload
      spicy, 
      extraSpicy, 
      vegan, 
      isActive,
      sortOrder 
    } = body

    // Validation
    if (!name?.en || !name?.et || !name?.ru) {
      return NextResponse.json({ error: "Names in all languages are required" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO menu_items (
        name_en, name_et, name_ru,
        description_en, description_et, description_ru,
        price, category_slug, image_url,
        is_spicy, is_extra_spicy, is_vegan,
        is_active, sort_order
      ) VALUES (
        ${name.en}, ${name.et}, ${name.ru},
        ${description?.en || null}, ${description?.et || null}, ${description?.ru || null},
        ${price}, ${category}, ${image || null},
        ${spicy ?? false}, ${extraSpicy ?? false}, ${vegan ?? false},
        ${isActive ?? true}, ${sortOrder ?? 0}
      )
      RETURNING *
    `

    return NextResponse.json(mapMenuItem(result[0]), { status: 201 })
  } catch (error: any) {
    console.error("Failed to create menu item:", error)
    
    // Check for foreign key constraint violation (if the category doesn't exist in the categories table)
    if (error.message?.includes('violates foreign key constraint')) {
      return NextResponse.json({ error: "Invalid category slug. Make sure the category exists." }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}