"use client"

import type { Offer } from "@/lib/offers-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Calendar, Tag } from "lucide-react"
import Image from "next/image"

interface OfferCardProps {
  offer: Offer
  onEdit: () => void
  onDelete: () => void
}

export function OfferCard({ offer, onEdit, onDelete }: OfferCardProps) {
  // Defensive calculation: Ensure prices exist before calculating percentage
  const original = offer?.originalPrice || 0
  const discount = offer?.discountPrice || 0
  const discountPercent = original > 0 
    ? Math.round(((original - discount) / original) * 100) 
    : 0

  // Helper to format DB dates for display (handles ISO strings and Date objects)
  const formatDate = (dateStr: any) => {
    if (!dateStr) return "N/A"
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch (e) {
      return String(dateStr)
    }
  }

  return (
    <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all bg-card shadow-sm">
      <div className="relative h-32">
        <Image
          src={offer?.image || "/placeholder.svg?height=128&width=320&query=food"}
          alt={offer?.title?.en || "Offer image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Status Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge
            variant="secondary"
            className={offer?.type === "daily" 
              ? "bg-orange-500/90 text-white border-none shadow-sm" 
              : "bg-blue-500/90 text-white border-none shadow-sm"}
          >
            <Tag className="w-3 h-3 mr-1" />
            {offer?.type === "daily" ? "Daily" : "Weekly"}
          </Badge>
          {!offer?.isActive && (
            <Badge variant="secondary" className="bg-destructive text-destructive-foreground border-none shadow-sm">
              Inactive
            </Badge>
          )}
        </div>

        {/* Pricing Badges */}
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <Badge className="bg-black/60 text-white font-bold line-through border-none backdrop-blur-sm">
            €{original}
          </Badge>
          <Badge className="bg-green-600 text-white font-bold border-none shadow-md">
            €{discount}
          </Badge>
          {discountPercent > 0 && (
            <Badge className="bg-primary text-primary-foreground font-bold border-none">
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Multilingual rendering with safety fallbacks */}
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {offer?.title?.en || "Untitled Offer"}
        </h3>
        <div className="space-y-0.5 mb-3">
          <p className="text-[10px] text-muted-foreground truncate italic">
            <span className="font-medium not-italic">ET:</span> {offer?.title?.et || "—"}
          </p>
          <p className="text-[10px] text-muted-foreground truncate italic">
            <span className="font-medium not-italic">RU:</span> {offer?.title?.ru || "—"}
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-4 bg-muted/30 p-1.5 rounded-md w-fit">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(offer?.validFrom)}</span>
          <span className="mx-0.5">→</span>
          <span>{formatDate(offer?.validUntil)}</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}