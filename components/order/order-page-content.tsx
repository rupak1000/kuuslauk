"use client"

import { useState } from "react"
import Link from "next/link"
import { useMenuData, type MenuItem } from "@/lib/menu-data"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/language-switcher"
import { OrderMenuItemCard } from "@/components/order/order-menu-item-card"
import { CartSidebar } from "@/components/order/cart-sidebar"
import { CheckoutModal } from "@/components/order/checkout-modal"
import { ArrowLeft, ShoppingCart, Utensils, UtensilsCrossed, Baby, IceCream } from "lucide-react"
import { DesktopCart } from "@/components/order/desktop-cart"

const categoryIcons = {
  starters: Utensils,
  wok: UtensilsCrossed,
  kebab: Utensils,
  kids: Baby,
  desserts: IceCream,
}

export function OrderPageContent() {
  const { menuItems } = useMenuData()
  const { getItemCount } = useCart()
  const { language, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<MenuItem["category"]>("wok")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const categoryLabels = {
    starters: t.menu.starters,
    wok: t.menu.wokDishes,
    kebab: t.menu.kebabDishes,
    kids: t.menu.kidsMenu,
    desserts: t.menu.desserts,
  }

  const titles = {
    en: "Order for Self Pickup",
    et: "Telli ise järele",
    ru: "Заказ на самовывоз",
  }

  const subtitles = {
    en: "Browse our menu and order online. Pick up when ready!",
    et: "Sirvi menüüd ja telli veebis. Tule järele, kui valmis!",
    ru: "Просмотрите меню и закажите онлайн. Заберите, когда будет готово!",
  }

  const filteredItems = menuItems.filter((item) => item.category === activeCategory)
  const itemCount = getItemCount()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-foreground hover:bg-primary/10">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "en" ? "Back" : language === "et" ? "Tagasi" : "Назад"}
              </Link>
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary">Küüslauk</h1>
              <p className="text-xs text-muted-foreground">Self Pickup</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent relative lg:hidden"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {language === "en" ? "Cart" : language === "et" ? "Ostukorv" : "Корзина"}
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 px-4 py-8 lg:pr-[340px]">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{titles[language]}</h1>
              <p className="text-muted-foreground text-lg">{subtitles[language]}</p>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as MenuItem["category"])}>
              <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
                {(Object.keys(categoryLabels) as MenuItem["category"][]).map((category) => {
                  const Icon = categoryIcons[category]
                  const count = menuItems.filter((item) => item.category === category).length
                  return (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
                    >
                      <Icon className="w-4 h-4" />
                      {categoryLabels[category]}
                      <span className="text-xs opacity-70">({count})</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {(Object.keys(categoryLabels) as MenuItem["category"][]).map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <OrderMenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>

        {/* Fixed Cart Panel for Desktop */}
        <aside className="hidden lg:flex flex-col fixed right-0 top-[73px] bottom-0 w-[320px] bg-background border-l border-primary/20 z-40">
          <DesktopCart onCheckout={() => setIsCheckoutOpen(true)} />
        </aside>
      </div>

      {/* Floating Cart Button (Mobile/Tablet) */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 lg:hidden z-40">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg shadow-lg"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {language === "en" ? "View Cart" : language === "et" ? "Vaata ostukorvi" : "Посмотреть корзину"} (
            {itemCount})
          </Button>
        </div>
      )}

      {/* Cart Sidebar (Mobile/Tablet) */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
