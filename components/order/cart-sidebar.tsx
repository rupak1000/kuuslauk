"use client"

import Image from "next/image"
import { useCart, getProteinExtraPrice } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-background border-primary/20 w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {titles[language]}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{emptyTitles[language]}</h3>
            <p className="text-muted-foreground">{emptySubtitles[language]}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.menuItem.image || "/placeholder.svg?height=64&width=64&query=food"}
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
                      <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
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

            <div className="border-t border-primary/20 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={clearCart}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {language === "en" ? "Clear Cart" : language === "et" ? "Tühjenda" : "Очистить"}
                </Button>
              </div>
              <Separator className="bg-primary/20" />
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-foreground">
                  {language === "en" ? "Total" : language === "et" ? "Kokku" : "Итого"}
                </span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                onClick={onCheckout}
              >
                {language === "en" ? "Proceed to Checkout" : language === "et" ? "Mine kassasse" : "Оформить заказ"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
