import { NextResponse } from "next/server"

interface ReadyEmailRequest {
  customerEmail: string
  customerName: string
  orderNumber: string
  pickupTime: string
  location: {
    address: string
    phone: string
    mapLink: string
  }
}

export async function POST(request: Request) {
  try {
    const body: ReadyEmailRequest = await request.json()
    const { customerEmail, customerName, orderNumber, pickupTime, location } = body

    // In production, you would integrate with an email service like:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // For now, we'll log the email that would be sent
    console.log("=== ORDER READY EMAIL ===")
    console.log(`To: ${customerEmail}`)
    console.log(`Subject: Your Order ${orderNumber} is Ready for Pickup!`)
    console.log(`
Dear ${customerName},

Great news! Your order ${orderNumber} is now READY for pickup!

📍 PICKUP LOCATION:
${location.address}

📞 Contact: ${location.phone}

🗺️ Google Maps: ${location.mapLink}

⏰ Your requested pickup time: ${pickupTime}

Please bring this email or your order number when you arrive.

Thank you for choosing Kuuslauk!

Best regards,
Kuuslauk Restaurant Team
    `)
    console.log("========================")

    // Simulate email sending success
    // In production, replace this with actual email service integration

    return NextResponse.json({
      success: true,
      message: "Ready notification sent",
      // This would be removed in production
      emailPreview: {
        to: customerEmail,
        subject: `Your Order ${orderNumber} is Ready for Pickup!`,
        pickupLocation: location.address,
        mapLink: location.mapLink,
        phone: location.phone,
      },
    })
  } catch (error) {
    console.error("Failed to send ready email:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
