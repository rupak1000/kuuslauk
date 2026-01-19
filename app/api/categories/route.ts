import { type NextRequest, NextResponse } from "next/server"
import { sql, isDatabaseAvailable } from "@/lib/db"

// GET - Fetch all categories
export async function GET() {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json([
      { id: "1", slug: "appetizers", name: { en: "Appetizers", et: "Eelroad", ru: "Закуски" }, sortOrder: 1 },
      { id: "2", slug: "wok", name: { en: "Wok Dishes", et: "Wok road", ru: "Вок блюда" }, sortOrder: 2 },
      { id: "3", slug: "kebab", name: { en: "Kebab", et: "Kebab", ru: "Кебаб" }, sortOrder: 3 },
      { id: "4", slug: "sides", name: { en: "Sides", et: "Lisandid", ru: "Гарниры" }, sortOrder: 4 },
      { id: "5", slug: "drinks", name: { en: "Drinks", et: "Joogid", ru: "Напитки" }, sortOrder: 5 },
    ])
  }

  try {
    const categories = await sql`
      SELECT * FROM categories ORDER BY sort_order ASC, id ASC
    `

    const transformedCategories = categories.map((cat: any) => ({
      id: cat.id.toString(),
      slug: cat.slug,
      name: {
        en: cat.name_en,
        et: cat.name_et,
        ru: cat.name_ru,
      },
      sortOrder: cat.sort_order,
    }))

    return NextResponse.json(transformedCategories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json([
      { id: "1", slug: "appetizers", name: { en: "Appetizers", et: "Eelroad", ru: "Закуски" }, sortOrder: 1 },
      { id: "2", slug: "wok", name: { en: "Wok Dishes", et: "Wok road", ru: "Вок блюда" }, sortOrder: 2 },
      { id: "3", slug: "kebab", name: { en: "Kebab", et: "Kebab", ru: "Кебаб" }, sortOrder: 3 },
      { id: "4", slug: "sides", name: { en: "Sides", et: "Lisandid", ru: "Гарниры" }, sortOrder: 4 },
      { id: "5", slug: "drinks", name: { en: "Drinks", et: "Joogid", ru: "Напитки" }, sortOrder: 5 },
    ])
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { slug, name, sortOrder } = body

    const result = await sql`
      INSERT INTO categories (slug, name_en, name_et, name_ru, sort_order)
      VALUES (${slug}, ${name.en}, ${name.et}, ${name.ru}, ${sortOrder || 0})
      RETURNING *
    `

    const cat = result[0]
    return NextResponse.json(
      {
        id: cat.id.toString(),
        slug: cat.slug,
        name: { en: cat.name_en, et: cat.name_et, ru: cat.name_ru },
        sortOrder: cat.sort_order,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
