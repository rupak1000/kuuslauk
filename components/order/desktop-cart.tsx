"use client"

import Image from "next/image"
import { useCart, getProteinExtraPrice } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

interface DesktopCartProps {
  onCheckout: () => void
}

export function DesktopCart({ onCheckout }: DesktopCartProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart()
  const { language } = useLanguage()

  const titles = {
    en: "Your Cart",
    et: "Sinu ostukorv",
    ru: "Ваша корзина",
  }

  const emptyTitles = {
    en: "Your cart is empty",
    et: "Ostukorv on tühi",
    ru: "Ваша корзина пуста",
  }

  const emptySubtitles = {
    en: "Add some delicious items to get started!",
    et: "Lisa mõned maitsvad toidud alustamiseks!",
    ru: "Добавьте вкусные блюда, чтобы начать!",
  }

  const total = getTotal()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-primary/20">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          {titles[language]}
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">{emptyTitles[language]}</h3>
          <p className="text-sm text-muted-foreground">{emptySubtitles[language]}</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.menuItem.image || "/placeholder.svg?height=56&width=56&query=food"}
                    alt={item.menuItem.name[language]}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-1">{item.menuItem.name[language]}</h4>
                  {item.proteinChoice && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.proteinChoice}
                      {getProteinExtraPrice(item.proteinChoice) > 0 && (
                        <span className="text-accent ml-1">+€{getProteinExtraPrice(item.proteinChoice)}</span>
                      )}
                    </p>
                  )}
                  {item.notes && <p className="text-xs text-muted-foreground italic line-clamp-1">{item.notes}</p>}
                  <p className="text-sm font-semibold text-primary mt-1">
                    €{(item.menuItem.price + getProteinExtraPrice(item.proteinChoice)).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 border-primary/20 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-5 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 border-primary/20 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-primary/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-500 text-xs"
                onClick={clearCart}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                {language === "en" ? "Clear" : language === "et" ? "Tühjenda" : "Очистить"}
              </Button>
            </div>
            <Separator className="bg-primary/20" />
            <div className="flex items-center justify-between text-base font-bold">
              <span className="text-foreground">
                {language === "en" ? "Total" : language === "et" ? "Kokku" : "Итого"}
              </span>
              <span className="text-primary">€{total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
              onClick={onCheckout}
            >
              {language === "en" ? "Checkout" : language === "et" ? "Maksma" : "Оформить"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
