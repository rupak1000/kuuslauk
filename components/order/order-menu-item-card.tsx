"use client"

import { useState } from "react"
import Image from "next/image"
import type { MenuItem } from "@/lib/menu-data"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Minus, Flame, Leaf, ShoppingCart, Check } from "lucide-react"

interface OrderMenuItemCardProps {
  item: MenuItem
}

export const proteinOptions = [
  { value: "chicken", en: "Chicken", et: "Kana", ru: "Курица", extraPrice: 0 },
  { value: "beef", en: "Beef", et: "Veiseliha", ru: "Говядина", extraPrice: 0 },
  { value: "pork", en: "Pork", et: "Sealiha", ru: "Свинина", extraPrice: 0 },
  { value: "shrimp", en: "Shrimp", et: "Krevetid", ru: "Креветки", extraPrice: 2 },
  { value: "tofu", en: "Tofu", et: "Tofu", ru: "Тофу", extraPrice: 0 },
]

export function OrderMenuItemCard({ item }: OrderMenuItemCardProps) {
  const { addItem } = useCart()
  const { language, t } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [selectedProtein, setSelectedProtein] = useState("chicken")
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  const hasProteinChoice =
    (item.category === "wok" || item.category === "kebab") &&
    item.description?.[language]?.toLowerCase().includes("chicken") &&
    (item.description?.[language]?.toLowerCase().includes("beef") ||
      item.description?.[language]?.toLowerCase().includes("tofu"))

  const getProteinExtraPrice = (protein: string) => {
    const option = proteinOptions.find((p) => p.value === protein)
    return option?.extraPrice || 0
  }

  const calculateItemPrice = () => {
    const basePrice = item.price
    const proteinExtra = hasProteinChoice ? getProteinExtraPrice(selectedProtein) : 0
    return (basePrice + proteinExtra) * quantity
  }

  const showAddedNotification = () => {
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const handleAddToCart = () => {
    const proteinChoice = hasProteinChoice ? selectedProtein : undefined
    addItem(item, quantity, notes || undefined, proteinChoice)
    setIsDialogOpen(false)
    setQuantity(1)
    setNotes("")
    setSelectedProtein("chicken")
    showAddedNotification()
  }

  const handleQuickAdd = () => {
    if (hasProteinChoice) {
      setIsDialogOpen(true)
    } else {
      addItem(item, 1)
      showAddedNotification()
    }
  }

  return (
    <>
      <Card className="border-primary/20 hover:border-primary/40 transition-all group flex flex-col">
        <div className="relative h-32 sm:h-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-t-lg" onClick={() => setIsDialogOpen(true)}>
          <Image
            src={item.image || "/placeholder.svg?height=144&width=320&query=food dish"}
            alt={item.name[language]}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {item.spicy && (
              <Badge variant="secondary" className="bg-red-500/90 text-white text-xs">
                <Flame className="w-3 h-3" />
              </Badge>
            )}
            {item.vegan && (
              <Badge variant="secondary" className="bg-green-500/90 text-white text-xs">
                <Leaf className="w-3 h-3" />
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-primary text-primary-foreground font-bold">€{item.price}</Badge>
          </div>
          {/* Added to cart notification */}
          {showAddedMessage && (
            <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center animate-in fade-in zoom-in duration-200">
              <div className="text-white text-center">
                <Check className="w-8 h-8 mx-auto mb-1" />
                <span className="text-sm font-semibold">
                  {language === "en" ? "Added!" : language === "et" ? "Lisatud!" : "Добавлено!"}
                </span>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex flex-col gap-2">
          <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.name[language]}</h3>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">{item.description[language]}</p>
          )}
          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {language === "en" ? "Add" : language === "et" ? "Lisa" : "Добавить"}
          </Button>
        </CardContent>
      </Card>

      {/* Item Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-background border-primary/20 max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* Fixed Image Header */}
          <div className="relative h-40 sm:h-48 flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg?height=192&width=400&query=food dish"}
              alt={item.name[language]}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-1">
              {item.spicy && (
                <Badge variant="secondary" className="bg-red-500/90 text-white">
                  <Flame className="w-3 h-3 mr-1" />
                  {t.menu.spicy}
                </Badge>
              )}
              {item.vegan && (
                <Badge variant="secondary" className="bg-green-500/90 text-white">
                  <Leaf className="w-3 h-3 mr-1" />
                  {t.menu.vegan}
                </Badge>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-foreground text-xl">{item.name[language]}</DialogTitle>
              {item.description && (
                <DialogDescription className="text-muted-foreground">{item.description[language]}</DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-4">
              {/* Protein Choice */}
              {hasProteinChoice && (
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">
                    {language === "en" ? "Choose Protein" : language === "et" ? "Vali valk" : "Выберите белок"}
                  </Label>
                  <RadioGroup
                    value={selectedProtein}
                    onValueChange={setSelectedProtein}
                    className="grid grid-cols-2 gap-2"
                  >
                    {proteinOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`${item.id}-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`${item.id}-${option.value}`}
                          className="flex items-center justify-center rounded-md border-2 border-primary/20 bg-secondary p-2 text-sm cursor-pointer hover:bg-primary/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20"
                        >
                          {option[language]}
                          {option.extraPrice > 0 && <span className="ml-1 text-accent">+€{option.extraPrice}</span>}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  {language === "en"
                    ? "Special Instructions"
                    : language === "et"
                      ? "Erilised soovid"
                      : "Особые пожелания"}
                </Label>
                <Textarea
                  placeholder={
                    language === "en"
                      ? "Any allergies or special requests..."
                      : language === "et"
                        ? "Allergiad või erisoovid..."
                        : "Аллергии или особые пожелания..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-secondary border-primary/20 text-foreground"
                  rows={2}
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-semibold">
                  {language === "en" ? "Quantity" : language === "et" ? "Kogus" : "Количество"}
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-primary/20 bg-transparent"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold text-foreground w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-primary/20 bg-transparent"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 border-t border-primary/20 bg-background">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {language === "en" ? "Add to Cart" : language === "et" ? "Lisa ostukorvi" : "Добавить в корзину"} - €
              {calculateItemPrice().toFixed(2)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
