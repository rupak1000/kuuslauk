"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

interface MenuItem {
  name: string
  description?: string
  price: number
  spicy?: boolean
  vegan?: boolean
  extraSpicy?: boolean
  image?: string
}

interface MenuCategoryProps {
  title: string
  items: MenuItem[]
}

export function MenuCategory({ title, items }: MenuCategoryProps) {
  const { t } = useLanguage()
  const hasImages = items.some((item) => item.image)

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-6 border-b border-primary/30 pb-3">{title}</h3>
      <div className={hasImages ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "grid gap-4"}>
        {items.map((item, index) => (
          <Card
            key={index}
            className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg overflow-hidden group"
          >
            {item.image && (
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Price badge on image */}
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  €{item.price.toFixed(item.price % 1 === 0 ? 0 : 1)}
                </div>
                {/* Spicy/Vegan badges */}
                <div className="absolute top-3 left-3 flex gap-1">
                  {item.spicy && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
                      {t.menu.spicy}
                    </span>
                  )}
                  {item.extraSpicy && (
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
                      {t.menu.extraHot}
                    </span>
                  )}
                  {item.vegan && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
                      {t.menu.vegan}
                    </span>
                  )}
                </div>
              </div>
            )}
            <CardContent className="p-4">
              <div className={item.image ? "" : "flex justify-between items-start gap-4"}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-primary">{item.name}</h4>
                  </div>
                  {item.description && <p className="text-sm text-primary/60 mt-1 line-clamp-2">{item.description}</p>}
                </div>
                {/* Only show price here if no image */}
                {!item.image && (
                  <span className="text-lg font-bold text-primary whitespace-nowrap">
                    €{item.price.toFixed(item.price % 1 === 0 ? 0 : 1)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
