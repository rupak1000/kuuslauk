"use client"

import type { MenuItem } from "@/lib/menu-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Flame, Leaf, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface MenuItemCardProps {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: () => void
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden border-amber-200 hover:border-amber-400 transition-all bg-white">
      <div className="relative h-40">
        <Image
          src={item.image || "/placeholder.svg?height=160&width=320&query=food dish"}
          alt={item.name.en}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
          {item.spicy && !item.extraSpicy && (
            <Badge variant="secondary" className="bg-red-500/90 text-white">
              <Flame className="w-3 h-3 mr-1" />
              Spicy
            </Badge>
          )}
          {item.extraSpicy && (
            <Badge variant="secondary" className="bg-orange-600/90 text-white">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Extra Hot
            </Badge>
          )}
          {item.vegan && (
            <Badge variant="secondary" className="bg-green-500/90 text-white">
              <Leaf className="w-3 h-3 mr-1" />
              Vegan
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-amber-500 text-white font-bold">€{item.price}</Badge>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name.en}</h3>
        <p className="text-xs text-gray-500 mb-1">ET: {item.name.et}</p>
        <p className="text-xs text-gray-500 mb-3">RU: {item.name.ru}</p>
        {item.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description.en}</p>}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.spicy && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Spicy</span>}
          {item.extraSpicy && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Extra Hot</span>
          )}
          {item.vegan && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Vegan Option</span>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-amber-300 text-gray-700 hover:bg-amber-50 bg-white"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50 bg-white"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
