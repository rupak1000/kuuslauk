"use client"

import { MenuCategory } from "@/components/menu-category"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useMenuData } from "@/lib/menu-data"

export function MenuSection() {
  const { t, language } = useLanguage()
  const { getItemsByCategory } = useMenuData()

  // Transform menu items to the format expected by MenuCategory
  const transformItems = (category: "starters" | "wok" | "kebab" | "kids" | "desserts") => {
    return getItemsByCategory(category).map((item) => ({
      name: item.name[language],
      description: item.description?.[language],
      price: item.price,
      image: item.image,
      spicy: item.spicy,
      extraSpicy: item.extraSpicy,
      vegan: item.vegan,
    }))
  }

  const starters = transformItems("starters")
  const wokDishes = transformItems("wok")
  const kebabDishes = transformItems("kebab")
  const kidsMenu = transformItems("kids")
  const desserts = transformItems("desserts")

  const featuredDishes = [
    {
      name: t.menu.featured.wok.name,
      image: "/asian-wok-stir-fry-cooking-flames.jpg",
      description: t.menu.featured.wok.description,
    },
    {
      name: t.menu.featured.kebab.name,
      image: "/mediterranean-kebab-plate-with-salad.jpg",
      description: t.menu.featured.kebab.description,
    },
    {
      name: t.menu.featured.spring.name,
      image: "/crispy-spring-rolls-appetizer-asian.jpg",
      description: t.menu.featured.spring.description,
    },
  ]

  return (
    <section id="menu" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">{t.menu.title}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">{t.menu.subtitle}</p>
        </div>

        {/* Featured Dishes Gallery */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featuredDishes.map((dish, index) => (
            <div key={index} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
              <Image
                src={dish.image || "/placeholder.svg"}
                alt={dish.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{dish.name}</h3>
                <p className="text-white/80 text-sm">{dish.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-12">
          <MenuCategory title={t.menu.starters} items={starters} />
          <MenuCategory title={t.menu.wokDishes} items={wokDishes} />
          <MenuCategory title={t.menu.kebabDishes} items={kebabDishes} />
          <div className="grid md:grid-cols-2 gap-12">
            <MenuCategory title={t.menu.kidsMenu} items={kidsMenu} />
            <MenuCategory title={t.menu.desserts} items={desserts} />
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="inline-block w-4 h-4 rounded-full bg-red-500" />
            <span>{t.menu.spicy}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
            <span>{t.menu.veganOption}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
