"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { useOrders } from "@/lib/orders-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, CreditCard, Banknote } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotal, clearCart } = useCart()
  const { language } = useLanguage()
  const { addOrder } = useOrders()
  const [step, setStep] = useState<"details" | "payment" | "success">("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupTime: "",
    notes: "",
    paymentMethod: "card" as "card" | "cash",
  })

  const total = getTotal()
  const pickupTimes = ["15 min", "30 min", "45 min", "1 hour", "1.5 hours", "2 hours"]

  const labels = {
    en: {
      title: "Checkout",
      yourDetails: "Your Details",
      name: "Full Name",
      phone: "Phone Number",
      email: "Email",
      pickupTime: "Pickup Time",
      selectTime: "Select pickup time",
      notes: "Additional Notes",
      notesPlaceholder: "Any special requests...",
      payment: "Payment Method",
      payOnline: "Pay Online",
      payOnArrival: "Pay on Arrival",
      orderSummary: "Order Summary",
      items: "items",
      total: "Total",
      placeOrder: "Place Order",
      processing: "Processing...",
      successTitle: "Order Placed Successfully!",
      successMessage: "Your order has been received. Please pick up your order at:",
      orderNumber: "Order Number",
      estimatedTime: "Estimated Ready Time",
      address: "Tartu mnt 58, Tallinn",
      backToMenu: "Back to Menu",
    },
    et: {
      title: "Kassa",
      yourDetails: "Sinu andmed",
      name: "Täisnimi",
      phone: "Telefoninumber",
      email: "E-post",
      pickupTime: "Järeletulemise aeg",
      selectTime: "Vali aeg",
      notes: "Lisamärkused",
      notesPlaceholder: "Erisoovid...",
      payment: "Makseviis",
      payOnline: "Maksa veebis",
      payOnArrival: "Maksa kohal",
      orderSummary: "Tellimuse kokkuvõte",
      items: "toodet",
      total: "Kokku",
      placeOrder: "Esita tellimus",
      processing: "Töötlemine...",
      successTitle: "Tellimus esitatud!",
      successMessage: "Sinu tellimus on vastu võetud. Tule järele:",
      orderNumber: "Tellimuse number",
      estimatedTime: "Eeldatav valmimisaeg",
      address: "Tartu mnt 58, Tallinn",
      backToMenu: "Tagasi menüüsse",
    },
    ru: {
      title: "Оформление",
      yourDetails: "Ваши данные",
      name: "Полное имя",
      phone: "Телефон",
      email: "Email",
      pickupTime: "Время самовывоза",
      selectTime: "Выберите время",
      notes: "Примечания",
      notesPlaceholder: "Особые пожелания...",
      payment: "Способ оплаты",
      payOnline: "Оплатить онлайн",
      payOnArrival: "Оплатить на месте",
      orderSummary: "Сводка заказа",
      items: "товаров",
      total: "Итого",
      placeOrder: "Разместить заказ",
      processing: "Обработка...",
      successTitle: "Заказ успешно оформлен!",
      successMessage: "Ваш заказ принят. Заберите заказ по адресу:",
      orderNumber: "Номер заказа",
      estimatedTime: "Время готовности",
      address: "Tartu mnt 58, Tallinn",
      backToMenu: "Назад в меню",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          items: items.map((item: any) => ({
            id: item.id,
            // Pass all possible name variations to ensure backend finds one
            name: item.name || item.name_en || item.title,
            quantity: item.quantity,
            price: item.price,
            proteinChoice: item.proteinChoice,
            notes: item.notes,
          })),
          total: total,
          pickupTime: formData.pickupTime,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to process order")
      }

      setOrderNumber(result.orderNumber)

      addOrder({
        id: result.orderId,
        orderNumber: result.orderNumber,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        items: [...items],
        total,
        pickupTime: formData.pickupTime,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        status: "pending",
      })

      setStep("success")
    } catch (error: any) {
      console.error("Order submission error:", error)
      alert(error.message || "Something went wrong while placing your order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (step === "success") {
      clearCart()
      setStep("details")
      setFormData({
        name: "",
        phone: "",
        email: "",
        pickupTime: "",
        notes: "",
        paymentMethod: "card",
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-background border-primary/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "details" && t.yourDetails}
            {step === "success" && t.successTitle}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">{t.name}</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-primary/20 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">{t.phone}</Label>
                <Input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-secondary border-primary/20 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">{t.email}</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">{t.pickupTime}</Label>
              <Select
                required
                value={formData.pickupTime}
                onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}
              >
                <SelectTrigger className="bg-secondary border-primary/20 text-foreground">
                  <SelectValue placeholder={t.selectTime} />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/20">
                  {pickupTimes.map((time) => (
                    <SelectItem key={time} value={time} className="text-foreground">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">{t.notes}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t.notesPlaceholder}
                className="bg-secondary border-primary/20 text-foreground"
                rows={2}
              />
            </div>

           <div className="space-y-2">
  <Label className="text-foreground">{t.payment}</Label>

  <div className="grid grid-cols-2 gap-3">
    {/* CARD (inactive) */}
    <Button
      type="button"
      disabled
      variant="outline"
      className="opacity-50 cursor-not-allowed border-primary/20 bg-transparent"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {t.payOnline}
    </Button>

    {/* CASH (active) */}
    <Button
      type="button"
      variant={formData.paymentMethod === "cash" ? "default" : "outline"}
      className={
        formData.paymentMethod === "cash"
          ? "bg-primary text-primary-foreground"
          : "border-primary/20 text-foreground hover:bg-primary/10 bg-transparent"
      }
      onClick={() =>
        setFormData({ ...formData, paymentMethod: "cash" })
      }
    >
      <Banknote className="w-4 h-4 mr-2" />
      {t.payOnArrival}
    </Button>
  </div>
</div>

            <Separator className="bg-primary/20" />

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">{t.orderSummary}</h4>
              <div className="text-sm text-muted-foreground">
                {items.length} {t.items}
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">{t.total}</span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.processing : t.placeOrder}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <div>
              <p className="text-muted-foreground mb-4">{t.successMessage}</p>
              <p className="text-lg font-semibold text-primary">{t.address}</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.orderNumber}</span>
                <span className="font-bold text-foreground">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.estimatedTime}</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formData.pickupTime}
                </span>
              </div>
              <Separator className="bg-primary/20" />
              <div className="flex justify-between text-lg">
                <span className="text-foreground">{t.total}</span>
                <span className="font-bold text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleClose}
              asChild
            >
              <a href="/">{t.backToMenu}</a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}