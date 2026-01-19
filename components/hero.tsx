"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { ShoppingBag } from "lucide-react"

export function Hero() {
  const { t, language } = useLanguage()

  const selfPickupLabels = {
    en: "Self Pickup Order",
    et: "Telli ise järele",
    ru: "Самовывоз",
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/asian-wok-cooking-with-flames-dark-moody-restauran.jpg"
          alt="Wok cooking"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Image
              src="/images/fb-img-1768642054869.jpg"
              alt="Küüslauk Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 text-balance">
            {t.hero.title1}
            <br />
            <span className="text-foreground">{t.hero.title2}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            {/* Delivery Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#00C2E8] hover:bg-[#00a8c9] text-white text-lg px-8">
                <a href="https://wolt.com/et/est/tallinn/restaurant/kuuslauk-kuuslauk" target="_blank" rel="noopener noreferrer">
                  {t.hero.orderWolt}
                </a>
              </Button>
              <Button asChild size="lg" className="bg-[#34D186] hover:bg-[#2bb873] text-white text-lg px-8">
                <a href="https://food.bolt.eu/en/1-tallinn/p/156155-kuuslauk-wok-kebab" target="_blank" rel="noopener noreferrer">
                  {t.hero.orderBolt}
                </a>
              </Button>
            </div>
            {/* Self Pickup Button */}
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 shadow-lg"
            >
              <Link href="/order">
                <ShoppingBag className="w-5 h-5 mr-2" />
                {selfPickupLabels[language]}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#offers" className="text-primary/60 hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
