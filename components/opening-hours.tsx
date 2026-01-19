"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function OpeningHours() {
  const { t } = useLanguage()

  return (
    <section id="hours" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">{t.hours.title}</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-lg text-muted-foreground">{t.hours.winterSchedule}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-foreground font-medium">{t.hours.monSat}</span>
                  <span className="text-primary font-bold text-lg">11:30 – 21:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-foreground font-medium">{t.hours.sunday}</span>
                  <span className="text-primary font-bold text-lg">12:00 – 20:00</span>
                </div>
              </div>

              <p className="mt-8 text-muted-foreground text-center">{t.hours.welcomeMessage}</p>
              <p className="mt-2 text-xl font-bold text-primary">{t.hours.waitingForYou}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
