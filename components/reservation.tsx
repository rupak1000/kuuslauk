"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, Users, Clock, UtensilsCrossed, CheckCircle2 } from "lucide-react"

import { useLanguage } from "@/lib/language-context"
import { useReservations } from "@/lib/reservations-context"

const timeSlots = [
  "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
]

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]

export function Reservation() {
  const { t } = useLanguage()
  const { addReservation } = useReservations()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    menu: "",
    notes: "",
  })

  const menuOptions = [
    { value: "regular",     label: t.reservation.regularMenu },
    { value: "full-course", label: t.reservation.fullCourseMenu },
    { value: "kids",        label: t.reservation.kidsMenuOption },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent double submit if already in progress
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      await addReservation({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        guests: Number.parseInt(formData.guests) || 1,
        menu: formData.menu || undefined,
        notes: formData.notes?.trim() || undefined,
      })

      // Success
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        menu: "",
        notes: "",
      })
    } catch (err) {
      console.error("Failed to create reservation:", err)
      // You can add a toast / alert here if you want
      // Example: toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="reservation" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-card border-border">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t.reservation.successTitle}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t.reservation.successMessage}
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {t.reservation.makeAnother}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="reservation" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t.reservation.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.reservation.subtitle}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarDays className="w-5 h-5 text-primary" />
              {t.reservation.detailsTitle}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    {t.reservation.fullName} *
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {t.reservation.email} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  {t.reservation.phone} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+372 5424 0020"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Date – Time – Guests */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    {t.reservation.date} *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {t.reservation.time} *
                  </Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder={t.reservation.selectTime} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {t.reservation.guests} *
                  </Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => setFormData({ ...formData, guests: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder={t.reservation.numberOfGuests} />
                    </SelectTrigger>
                    <SelectContent>
                      {guestOptions.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num} {num === "1" ? t.reservation.guest : t.reservation.guestsLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Menu Preference */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  {t.reservation.menuPreference}
                </Label>
                <Select
                  value={formData.menu}
                  onValueChange={(value) => setFormData({ ...formData, menu: value })}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder={t.reservation.selectMenu} />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  {t.reservation.notes}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={t.reservation.notesPlaceholder}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-background border-border min-h-[100px] text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              >
                {isSubmitting ? t.reservation.submitting : t.reservation.submit}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {t.reservation.confirmationNote}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}