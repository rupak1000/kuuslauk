"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag, Clock, Calendar, Loader2 } from "lucide-react"

// Ensure this matches your API response structure
export type Offer = {
  id: string
  title: { en: string; et: string; ru: string }
  description: { en: string; et: string; ru: string }
  originalPrice: number
  discountPrice: number
  type: "daily" | "weekly"
  image: string
  isActive: boolean
}

function OfferCard({ offer }: { offer: Offer }) {
  const { language } = useLanguage()
  const discountPercent = Math.round(((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100)

  return (
    <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all group">
      <div className="relative h-48 md:h-56">
        <Image
          src={offer.image || "/placeholder.svg?height=224&width=400"}
          alt={offer.title[language] || "Offer"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge
            className={`${
              offer.type === "daily" ? "bg-orange-500/90 hover:bg-orange-500" : "bg-blue-500/90 hover:bg-blue-500"
            } text-white`}
          >
            {offer.type === "daily" ? (
              <><Clock className="w-3 h-3 mr-1" />{language === "en" ? "Daily Offer" : language === "et" ? "Päevapakkumine" : "Ежедневное"}</>
            ) : (
              <><Calendar className="w-3 h-3 mr-1" />{language === "en" ? "Weekly Offer" : language === "et" ? "Nädalapakkumine" : "Еженедельное"}</>
            )}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-accent text-accent-foreground font-bold text-lg px-3">-{discountPercent}%</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 text-balance">{offer.title[language]}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{offer.description[language]}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground line-through text-lg">€{offer.originalPrice}</span>
            <span className="text-2xl font-bold text-primary">€{offer.discountPrice}</span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {language === "en" ? "Save" : language === "et" ? "Säästad" : "Экономия"} €
            {(offer.originalPrice - offer.discountPrice).toFixed(0)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export function OffersSection() {
  const { language } = useLanguage()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      try {
        // Point this to your API route (e.g., /api/offers)
        const response = await fetch("/api/offers")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        
        // Filter only active ones if your API doesn't do it already
        setOffers(data.filter((o: Offer) => o.isActive))
      } catch (error) {
        console.error("Error loading offers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (offers.length === 0) return null

  const titles = { en: "Special Offers", et: "Eripakkumised", ru: "Специальные предложения" }
  const subtitles = {
    en: "Don't miss our amazing daily and weekly deals!",
    et: "Ära jäta kasutamata meie imelisi päeva- ja nädalapakkumisi!",
    ru: "Не упустите наши удивительные ежедневные и еженедельные предложения!",
  }

  return (
    <section id="offers" className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="w-6 h-6 text-accent" />
            <span className="text-accent font-medium uppercase tracking-wider text-sm">
              {language === "en" ? "Limited Time" : language === "et" ? "Piiratud aeg" : "Ограниченное время"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            {titles[language]}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">{subtitles[language]}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}