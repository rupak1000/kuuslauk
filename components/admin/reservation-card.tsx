"use client"

import type { Reservation } from "@/lib/reservations-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  FileText,
  Utensils,
  Check,
  X,
  Trash2,
  CheckCircle,
} from "lucide-react"

interface ReservationCardProps {
  reservation: Reservation
  onUpdateStatus: (status: Reservation["status"]) => void
  onDelete: () => void
}

const menuLabels: Record<string, string> = {
  regular: "Regular Menu",
  "full-course": "Full Course Menu (€21)",
  kids: "Kids Menu",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  completed: "bg-green-100 text-green-800 border-green-300",
}

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
}

export function ReservationCard({ reservation, onUpdateStatus, onDelete }: ReservationCardProps) {
  const formattedDate = new Date(reservation.date).toLocaleDateString("et-EE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            {reservation.name}
          </CardTitle>
          <Badge className={statusColors[reservation.status]}>{statusLabels[reservation.status]}</Badge>
        </div>
        <p className="text-xs text-gray-500">Received: {new Date(reservation.createdAt).toLocaleString("et-EE")}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${reservation.email}`} className="hover:text-amber-600">
              {reservation.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${reservation.phone}`} className="hover:text-amber-600">
              {reservation.phone}
            </a>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{reservation.guests} guests</span>
          </div>
          {reservation.menu && (
            <div className="flex items-center gap-2 text-gray-700">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span className="font-medium">{menuLabels[reservation.menu] || reservation.menu}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {reservation.notes && (
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-start gap-2 text-gray-700">
              <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-sm">{reservation.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {reservation.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onUpdateStatus("confirmed")}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus("cancelled")}
                className="border-red-300 text-red-600 hover:bg-red-50 bg-white"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
          {reservation.status === "confirmed" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus("completed")}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Completed
            </Button>
          )}
          {(reservation.status === "completed" || reservation.status === "cancelled") && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="border-gray-300 text-gray-600 hover:bg-gray-100 bg-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
