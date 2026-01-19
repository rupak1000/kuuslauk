"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Soup, Cake, Beer } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FullCourseMenu() {
  const { t } = useLanguage()

  return (
    <section id="full-course" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-primary/20 overflow-hidden">
            <div className="bg-primary/10 py-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t.fullCourse.title}</h2>
              <p className="text-5xl font-bold text-foreground">€21</p>
            </div>
            <CardContent className="p-8">
              <div className="grid gap-8">
                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Soup className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.fullCourse.starter}</h3>
                    <p className="text-lg text-primary font-medium">{t.fullCourse.starterName}</p>
                    <p className="text-sm text-muted-foreground">{t.fullCourse.starterDesc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="p-3 rounded-full bg-primary/10">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.fullCourse.mainCourse}</h3>
                    <p className="text-lg text-primary font-medium">{t.fullCourse.mainCourseName}</p>
                    <p className="text-sm text-muted-foreground">{t.fullCourse.mainCourseDesc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Cake className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.fullCourse.dessert}</h3>
                    <p className="text-lg text-primary font-medium">{t.fullCourse.dessertName}</p>
                    <p className="text-sm text-muted-foreground">{t.fullCourse.dessertDesc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Beer className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.fullCourse.drink}</h3>
                    <p className="text-lg text-primary font-medium">{t.fullCourse.drinkName}</p>
                    <p className="text-sm text-muted-foreground">{t.fullCourse.drinkDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#00C2E8] hover:bg-[#00a8c9] text-white">
                  <a href="https://wolt.com/et/est/tallinn/restaurant/kuuslauk-kuuslauk" target="_blank" rel="noopener noreferrer">
                    {t.fullCourse.orderWolt}
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-[#34D186] hover:bg-[#2bb873] text-white">
                  <a href="https://food.bolt.eu/en/1-tallinn/p/156155-kuuslauk-wok-kebab" target="_blank" rel="noopener noreferrer">
                    {t.fullCourse.orderBolt}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
