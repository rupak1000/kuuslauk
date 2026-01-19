"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMenuData, type MenuItem } from "@/lib/menu-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/admin/image-upload"
import { Flame, AlertTriangle, Leaf } from "lucide-react"

interface MenuItemFormProps {
  item: MenuItem | null
  defaultCategory: MenuItem["category"]
  onClose: () => void
}

const categoryOptions = [
  { value: "starters", label: "Starters" },
  { value: "wok", label: "Wok Dishes" },
  { value: "kebab", label: "Kebab Dishes" },
  { value: "kids", label: "Kids Menu" },
  { value: "desserts", label: "Desserts" },
]

export function MenuItemForm({ item, defaultCategory, onClose }: MenuItemFormProps) {
  const { addMenuItem, updateMenuItem } = useMenuData()
  const isEditing = !!item

  const [formData, setFormData] = useState({
    nameEn: item?.name?.en || "",
    nameEt: item?.name?.et || "",
    nameRu: item?.name?.ru || "",
    descEn: item?.description?.en || "",
    descEt: item?.description?.et || "",
    descRu: item?.description?.ru || "",
    price: item?.price?.toString() || "",
    category: item?.category || defaultCategory,
    image: item?.image || "",
    spicy: item?.spicy ?? false,
    extraSpicy: item?.extraSpicy ?? false,
    vegan: item?.vegan ?? false,
  })

  // Reset form data when item changes (for editing different items)
  useEffect(() => {
    setFormData({
      nameEn: item?.name?.en || "",
      nameEt: item?.name?.et || "",
      nameRu: item?.name?.ru || "",
      descEn: item?.description?.en || "",
      descEt: item?.description?.et || "",
      descRu: item?.description?.ru || "",
      price: item?.price?.toString() || "",
      category: item?.category || defaultCategory,
      image: item?.image || "",
      spicy: item?.spicy ?? false,
      extraSpicy: item?.extraSpicy ?? false,
      vegan: item?.vegan ?? false,
    })
  }, [item, defaultCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const menuItemData: Omit<MenuItem, "id"> = {
      name: {
        en: formData.nameEn,
        et: formData.nameEt,
        ru: formData.nameRu,
      },
      description: formData.descEn
        ? {
            en: formData.descEn,
            et: formData.descEt,
            ru: formData.descRu,
          }
        : undefined,
      price: Number.parseFloat(formData.price) || 0,
      category: formData.category as MenuItem["category"],
      image: formData.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(formData.nameEn)}`,
      spicy: formData.spicy,
      extraSpicy: formData.extraSpicy,
      vegan: formData.vegan,
    }

    if (isEditing && item) {
      updateMenuItem(item.id, menuItemData)
    } else {
      addMenuItem(menuItemData)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{isEditing ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill in the details for the menu item in all three languages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold">Item Name</Label>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="bg-gray-100">
                <TabsTrigger
                  value="en"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="et"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  Estonian
                </TabsTrigger>
                <TabsTrigger
                  value="ru"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  Russian
                </TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Input
                  placeholder="Item name in English"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
              <TabsContent value="et">
                <Input
                  placeholder="Item name in Estonian"
                  value={formData.nameEt}
                  onChange={(e) => setFormData({ ...formData, nameEt: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
              <TabsContent value="ru">
                <Input
                  placeholder="Item name in Russian"
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  required
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold">Description (Optional)</Label>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="bg-gray-100">
                <TabsTrigger
                  value="en"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="et"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  Estonian
                </TabsTrigger>
                <TabsTrigger
                  value="ru"
                  className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  Russian
                </TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Textarea
                  placeholder="Description in English"
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
              <TabsContent value="et">
                <Textarea
                  placeholder="Description in Estonian"
                  value={formData.descEt}
                  onChange={(e) => setFormData({ ...formData, descEt: e.target.value })}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
              <TabsContent value="ru">
                <Textarea
                  placeholder="Description in Russian"
                  value={formData.descRu}
                  onChange={(e) => setFormData({ ...formData, descRu: e.target.value })}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900">Price (€)</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                placeholder="12.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-gray-900">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Food Image"
            placeholder={formData.nameEn || "food dish"}
          />

          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold">Dietary Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Spicy Option */}
              <button
                type="button"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                  formData.spicy ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, spicy: !prev.spicy }))}
              >
                <div
                  className={`p-2 rounded-full ${formData.spicy ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Spicy</p>
                  <p className="text-xs text-gray-500">Mild heat level</p>
                </div>
                <div
                  className={`w-8 h-5 rounded-full transition-colors relative ${formData.spicy ? "bg-red-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.spicy ? "translate-x-3.5" : "translate-x-0.5"}`}
                  />
                </div>
              </button>

              {/* Extra Spicy Option */}
              <button
                type="button"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                  formData.extraSpicy
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, extraSpicy: !prev.extraSpicy }))}
              >
                <div
                  className={`p-2 rounded-full ${formData.extraSpicy ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Extra Hot</p>
                  <p className="text-xs text-gray-500">Very spicy!</p>
                </div>
                <div
                  className={`w-8 h-5 rounded-full transition-colors relative ${formData.extraSpicy ? "bg-orange-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.extraSpicy ? "translate-x-3.5" : "translate-x-0.5"}`}
                  />
                </div>
              </button>

              {/* Vegan Option */}
              <button
                type="button"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                  formData.vegan ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, vegan: !prev.vegan }))}
              >
                <div
                  className={`p-2 rounded-full ${formData.vegan ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Vegan</p>
                  <p className="text-xs text-gray-500">Plant-based option</p>
                </div>
                <div
                  className={`w-8 h-5 rounded-full transition-colors relative ${formData.vegan ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.vegan ? "translate-x-3.5" : "translate-x-0.5"}`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-amber-500 text-white hover:bg-amber-600">
              {isEditing ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
