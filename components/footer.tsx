"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useSiteSettings } from "@/lib/site-settings-context"

export function Footer() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 overflow-hidden">
                {settings.logo ? (
                  <Image
                    src={settings.logo || "/placeholder.svg"}
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                    <path d="M50 5 C45 25, 35 40, 50 60 C65 40, 55 25, 50 5 M50 60 C40 65, 35 80, 50 95 C65 80, 60 65, 50 60" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider text-primary">KÜÜSLAUK</span>
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground">- WOK & KEBAB -</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.quickLinks}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t.nav.menu}
              </Link>
              <Link href="#full-course" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t.nav.fullCourse}
              </Link>
              <Link href="#hours" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t.nav.hours}
              </Link>
              <Link href="#reservation" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t.footer.reserveTable}
              </Link>
              <Link href="#location" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t.nav.location}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.contact}</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+37254240020"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                5424 0020
              </a>
              <div className="text-sm text-muted-foreground flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Sadama tn 7<br />
                  10111 Tallinn, Estonia
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.orderOnline}</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://wolt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#00C2E8] transition-colors"
              >
                Wolt
              </a>
              <a
                href="https://bolt.eu/food"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#34D186] transition-colors"
              >
                Bolt Food
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Küüslauk - Wok & Kebab. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
