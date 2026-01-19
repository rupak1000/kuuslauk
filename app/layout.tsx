import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { MenuDataProvider } from "@/lib/menu-data"
import { OffersDataProvider } from "@/lib/offers-data"
import { CartProvider } from "@/lib/cart-context"
import { SiteSettingsProvider } from "@/lib/site-settings-context"
import { OrdersProvider } from "@/lib/orders-context"
import { ReservationsProvider } from "@/lib/reservations-context"
import "./globals.css"

const _playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair" })
const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Küüslauk - Wok & Kebab | Tallinn",
  description:
    "Authentic Asian wok dishes and delicious kebabs in Tallinn, Estonia. Fresh ingredients, bold flavors. Order now via Bolt or Wolt!",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        <SiteSettingsProvider>
          <MenuDataProvider>
            <OffersDataProvider>
              <OrdersProvider>
                <ReservationsProvider>
                  <CartProvider>
                    <LanguageProvider>{children}</LanguageProvider>
                  </CartProvider>
                </ReservationsProvider>
              </OrdersProvider>
            </OffersDataProvider>
          </MenuDataProvider>
        </SiteSettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
