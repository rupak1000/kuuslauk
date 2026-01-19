"use client"

import type React from "react"
import { useState } from "react"
import { type Offer } from "@/lib/offers-data"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2 } from "lucide-react"

interface OfferFormProps {
  offer: Offer | null
  onClose: () => void
}

export function OfferForm({ offer, onClose }: OfferFormProps) {
  const router = useRouter()
  const isEditing = !!offer
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    titleEn: offer?.title?.en || "",
    titleEt: offer?.title?.et || "",
    titleRu: offer?.title?.ru || "",
    descEn: offer?.description?.en || "",
    descEt: offer?.description?.et || "",
    descRu: offer?.description?.ru || "",
    originalPrice: offer?.originalPrice?.toString() || "",
    discountPrice: offer?.discountPrice?.toString() || "",
    type: offer?.type || "daily",
    validFrom: offer?.validFrom || new Date().toISOString().split("T")[0],
    validUntil: offer?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    image: offer?.image || "",
    isActive: offer?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const offerData = {
      title: {
        en: formData.titleEn,
        et: formData.titleEt,
        ru: formData.titleRu,
      },
      description: {
        en: formData.descEn,
        et: formData.descEt,
        ru: formData.descRu,
      },
      originalPrice: Number.parseFloat(formData.originalPrice) || 0,
      discountPrice: Number.parseFloat(formData.discountPrice) || 0,
      type: formData.type,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      image: formData.image,
      isActive: formData.isActive,
    }

    try {
      const url = isEditing ? `/api/offers/${offer.id}` : "/api/offers"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      })

      if (!response.ok) throw new Error("Failed to save offer")

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Submission error:", error)
      alert("Error saving offer. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-bold">
            {isEditing ? "Edit Offer" : "Add New Offer"}
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Fill in the offer details in all three languages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold text-base">Offer Title</Label>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="bg-gray-100 border border-gray-200">
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="et"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  Estonian
                </TabsTrigger>
                <TabsTrigger
                  value="ru"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  Russian
                </TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="pt-3">
                <Input
                  placeholder="English title"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500"
                />
              </TabsContent>
              <TabsContent value="et" className="pt-3">
                <Input
                  placeholder="Estonian title"
                  value={formData.titleEt}
                  onChange={(e) => setFormData({ ...formData, titleEt: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500"
                />
              </TabsContent>
              <TabsContent value="ru" className="pt-3">
                <Input
                  placeholder="Russian title"
                  value={formData.titleRu}
                  onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold text-base">Description</Label>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="bg-gray-100 border border-gray-200">
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="et"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  Estonian
                </TabsTrigger>
                <TabsTrigger
                  value="ru"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-700"
                >
                  Russian
                </TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="pt-3">
                <Textarea
                  placeholder="English description"
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 min-h-[100px]"
                />
              </TabsContent>
              <TabsContent value="et" className="pt-3">
                <Textarea
                  placeholder="Estonian description"
                  value={formData.descEt}
                  onChange={(e) => setFormData({ ...formData, descEt: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 min-h-[100px]"
                />
              </TabsContent>
              <TabsContent value="ru" className="pt-3">
                <Textarea
                  placeholder="Russian description"
                  value={formData.descRu}
                  onChange={(e) => setFormData({ ...formData, descRu: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 min-h-[100px]"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Pricing and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900">Original Price (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                required
                className="bg-white border-gray-300 text-gray-900 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">Discount Price (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                required
                className="bg-white border-gray-300 text-gray-900 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">Offer Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-amber-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900">Valid From</Label>
              <Input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                required
                className="bg-white border-gray-300 text-gray-900 focus:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">Valid Until</Label>
              <Input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
                className="bg-white border-gray-300 text-gray-900 focus:border-amber-500"
              />
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Offer Image"
          />

          <div className="flex items-center gap-3">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
            />
            <Label className="text-gray-900 font-medium">Offer is Active</Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-gray-400 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditing ? (
                "Update Offer"
              ) : (
                "Create Offer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}