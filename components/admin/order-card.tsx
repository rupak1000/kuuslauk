"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import type { Order } from "@/lib/orders-context"
import { getProteinExtraPrice } from "@/lib/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  ChefHat,
  CheckCircle,
  Package,
  Trash2,
  MapPin,
  Bell,
  Loader2,
} from "lucide-react"

interface OrderCardProps {
  order: Order
  onUpdateStatus: (status: Order["status"]) => void
  onDelete: () => void
}

export function OrderCard({ order, onUpdateStatus, onDelete }: OrderCardProps) {
  const { language } = useLanguage()
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    preparing: "bg-blue-100 text-blue-700 border-blue-300",
    ready: "bg-green-100 text-green-700 border-green-300",
    completed: "bg-gray-100 text-gray-700 border-gray-300",
  }

  const statusLabels = {
    pending: { en: "Pending", et: "Ootel", ru: "Ожидает" },
    preparing: { en: "Preparing", et: "Valmistamisel", ru: "Готовится" },
    ready: { en: "Ready", et: "Valmis", ru: "Готов" },
    completed: { en: "Completed", et: "Lõpetatud", ru: "Завершен" },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "et" ? "et-EE" : language === "ru" ? "ru-RU" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleMarkReady = async () => {
    setIsSendingNotification(true)
    onUpdateStatus("ready")
    // Small delay to show loading state
    setTimeout(() => {
      setIsSendingNotification(false)
    }, 1000)
  }

  return (
    <Card className="border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900">{order.orderNumber}</span>
          <Badge className={statusColors[order.status]}>{statusLabels[order.status][language]}</Badge>
        </div>
        <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
      </div>
      <CardContent className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <User className="w-4 h-4" />
            <span className="text-gray-900">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Phone className="w-4 h-4" />
            <span className="text-gray-900">{order.customerPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="w-4 h-4" />
            <span className="text-gray-900 text-xs">{order.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-gray-900">{order.pickupTime}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === "en" ? "Items" : language === "et" ? "Tooted" : "Товары"}
          </h4>
          {order.items.map((item, index) => {
            const proteinExtra = getProteinExtraPrice(item.proteinChoice)
            const itemPrice = (item.menuItem.price + proteinExtra) * item.quantity
            return (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <span className="text-amber-600 font-medium">{item.quantity}x</span>
                  <div>
                    <span className="text-gray-900">{item.menuItem.name[language]}</span>
                    {item.proteinChoice && (
                      <span className="text-gray-500 text-xs ml-1">
                        ({item.proteinChoice}
                        {proteinExtra > 0 && <span className="text-amber-600"> +€{proteinExtra}</span>})
                      </span>
                    )}
                    {item.notes && <p className="text-gray-500 text-xs italic">"{item.notes}"</p>}
                  </div>
                </div>
                <span className="text-gray-900">€{itemPrice.toFixed(2)}</span>
              </div>
            )
          })}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
            <span className="text-gray-900">{language === "en" ? "Total" : language === "et" ? "Kokku" : "Итого"}</span>
            <span className="text-amber-600">€{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center gap-2 text-sm">
          {order.paymentMethod === "card" ? (
            <>
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-gray-900">
                {language === "en" ? "Online Payment" : language === "et" ? "Veebimakse" : "Онлайн оплата"}
              </span>
            </>
          ) : (
            <>
              <Banknote className="w-4 h-4 text-green-500" />
              <span className="text-gray-900">
                {language === "en" ? "Pay on Arrival" : language === "et" ? "Maksa kohal" : "Оплата на месте"}
              </span>
            </>
          )}
        </div>

        {order.notes && (
          <div className="text-sm">
            <span className="text-gray-500">
              {language === "en" ? "Notes" : language === "et" ? "Märkused" : "Примечания"}:
            </span>
            <p className="text-gray-900 italic">"{order.notes}"</p>
          </div>
        )}

        {order.status === "ready" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <Bell className="w-4 h-4" />
              {language === "en" ? "Customer Notified" : language === "et" ? "Klient teavitatud" : "Клиент уведомлен"}
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="text-gray-900">Sadama tn 7, 10111 Tallinn</p>
                <p>5424 0020</p>
                <a
                  href="https://maps.app.goo.gl/MC6A1CWw34dXzTsk9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  {language === "en" ? "View on Map" : language === "et" ? "Vaata kaardil" : "Показать на карте"}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {order.status === "pending" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus("preparing")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ChefHat className="w-4 h-4 mr-1" />
              {language === "en" ? "Start Preparing" : language === "et" ? "Alusta valmistamist" : "Начать готовку"}
            </Button>
          )}
          {order.status === "preparing" && (
            <Button
              size="sm"
              onClick={handleMarkReady}
              disabled={isSendingNotification}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSendingNotification ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Package className="w-4 h-4 mr-1" />
              )}
              {isSendingNotification
                ? language === "en"
                  ? "Notifying..."
                  : language === "et"
                    ? "Teavitan..."
                    : "Уведомление..."
                : language === "en"
                  ? "Mark Ready & Notify"
                  : language === "et"
                    ? "Märgi valmis ja teavita"
                    : "Готов и уведомить"}
            </Button>
          )}
          {order.status === "ready" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus("completed")}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {language === "en" ? "Complete" : language === "et" ? "Lõpeta" : "Завершить"}
            </Button>
          )}
          {order.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {language === "en" ? "Delete" : language === "et" ? "Kustuta" : "Удалить"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
