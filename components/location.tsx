"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function Location() {
  const { t } = useLanguage()

  return (
    <section id="location" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.location.title}</h2>
          <p className="text-muted-foreground">{t.location.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-card border-border overflow-hidden">
            <div className="aspect-video relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.5!2d24.7619!3d59.4428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692935a7a7b3f3d%3A0x0!2sSadama%20tn%207%2C%2010111%20Tallinn!5e0!3m2!1sen!2see!4v1600000000000!5m2!1sen!2see"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Küüslauk location"
                className="absolute inset-0"
              />
            </div>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.location.address}</h3>
                    <p className="text-muted-foreground">Sadama tn 7</p>
                    <p className="text-muted-foreground">10111 Tallinn, Estonia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.location.phone}</h3>
                    <a
                      href="tel:+37254240020"
                      className="text-muted-foreground hover:text-primary transition-colors text-lg"
                    >
                      5424 0020
                    </a>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <a
                    href="https://maps.app.goo.gl/Gs3zLUuveXhsDd4NA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t.location.getDirections}
                  </a>
                </Button>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">{t.location.orderDelivery}</h3>
                  <div className="flex flex-col gap-3">
                    <Button asChild className="bg-[#00C2E8] hover:bg-[#00a8c9] text-white w-full">
                      <a href="https://wolt.com/et/est/tallinn/restaurant/kuuslauk-kuuslauk" target="_blank" rel="noopener noreferrer">
                        {t.location.orderWolt}
                      </a>
                    </Button>
                    <Button asChild className="bg-[#34D186] hover:bg-[#2bb873] text-white w-full">
                      <a href="https://food.bolt.eu/en/1-tallinn/p/156155-kuuslauk-wok-kebab" target="_blank" rel="noopener noreferrer">
                        {t.location.orderBolt}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
