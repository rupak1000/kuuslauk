"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"
import { useSiteSettings } from "@/lib/site-settings-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, language } = useLanguage()
  const { settings } = useSiteSettings()

  // ✅ logo fallback handling
  const [logoSrc, setLogoSrc] = useState(
    settings.logo || "/logo.png"
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-26 h-12 overflow-hidden">
              <Image
                src={logoSrc}
                alt="Logo"
                width={250}
                height={100}
                className="object-contain"
                onError={() => setLogoSrc("/logo.png")}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#offers" className="text-primary/80 hover:text-primary transition-colors font-medium">
              {language === "en" ? "Offers" : language === "et" ? "Pakkumised" : "Предложения"}
            </Link>
            <Link href="#menu" className="text-primary/80 hover:text-primary transition-colors font-medium">
              {t.nav.menu}
            </Link>
            <Link href="#reservation" className="text-primary/80 hover:text-primary transition-colors font-medium">
              {t.nav.reserve}
            </Link>
            <Link href="#location" className="text-primary/80 hover:text-primary transition-colors font-medium">
              {t.nav.location}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              title={language === "en" ? "Admin" : language === "et" ? "Admin" : "Админ"}
            >
              <Link href="/admin">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button className="text-primary p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="#offers"
                className="text-primary/80 hover:text-primary transition-colors font-medium text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === "en" ? "Offers" : language === "et" ? "Pakkumised" : "Предложения"}
              </Link>
              <Link
                href="#menu"
                className="text-primary/80 hover:text-primary transition-colors font-medium text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.menu}
              </Link>
              <Link
                href="#reservation"
                className="text-primary/80 hover:text-primary transition-colors font-medium text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.reserve}
              </Link>
              <Link
                href="#location"
                className="text-primary/80 hover:text-primary transition-colors font-medium text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.location}
              </Link>
              <div className="flex items-center gap-3 mt-4">
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                  title={language === "en" ? "Admin" : language === "et" ? "Admin" : "Админ"}
                >
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
