import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: Request) {
  try {
    const { items, orderId, customerEmail } = await req.json()

    if (!items?.length || !orderId) {
      return NextResponse.json({ error: "Missing items or order ID" }, { status: 400 })
    }

    console.log("[STRIPE] Creating session for order:", orderId)
    console.log("[STRIPE] Received items:", JSON.stringify(items, null, 2))

    const cleanPrice = (raw: any): number => {
      if (typeof raw === 'number') return raw
      if (!raw) return 0

      let str = String(raw)
        .replace(/[^\d.,-]/g, '')      // remove everything except digits, dot, comma, minus
        .trim()

      // Handle European decimal separator (comma)
      if (str.includes(',') && !str.includes('.')) {
        str = str.replace(',', '.')
      }

      const num = Number(str)
      return isNaN(num) ? 0 : num
    }

    const line_items = items.map((item: any, index: number) => {
      const unitPrice = cleanPrice(item.price)

      console.log(
        `[STRIPE] Item ${index + 1}: "${item.name}" | raw: ${item.price} → cleaned: ${unitPrice}`
      )

      if (unitPrice <= 0) {
        console.warn(`[STRIPE] ZERO/INVALID PRICE DETECTED: ${item.name}`)
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name || "Unnamed product",
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: Number(item.quantity) || 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customerEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=cancel&orderId=${orderId}`,
      metadata: { orderId: String(orderId) },
    })

    console.log("[STRIPE] Session created successfully → URL:", session.url)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("[STRIPE] Checkout creation failed:", {
      message: err.message,
      stack: err.stack,
      type: err.type,
      code: err.code,
    })

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}