import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { OffersSection } from "@/components/offers-section"
import { MenuSection } from "@/components/menu-section"
import { FullCourseMenu } from "@/components/full-course-menu"
import { OpeningHours } from "@/components/opening-hours"
import { Location } from "@/components/location"
import { Reservation } from "@/components/reservation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <OffersSection />
      <MenuSection />
      <FullCourseMenu />
      <OpeningHours />
      <Reservation />
      <Location />
      <Footer />
    </main>
  )
}
