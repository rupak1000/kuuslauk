"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import type { CartItem } from "@/lib/cart-context"

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  items: CartItem[]
  total: number
  pickupTime: string
  paymentMethod: "card" | "cash"
  notes?: string
  status: "pending" | "preparing" | "ready" | "completed"
  createdAt: string
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
  deleteOrder: (id: string) => void
  getPendingOrders: () => Order[]
  getCompletedOrders: () => Order[]
  newOrderAlert: boolean
  clearNewOrderAlert: () => void
  playNotificationSound: () => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const RESTAURANT_LOCATION = {
  address: "Sadama tn 7, 10111 Tallinn",
  phone: "5424 0020",
  mapLink: "https://maps.app.goo.gl/MC6A1CWw34dXzTsk9",
}

const ADMIN_EMAIL = "admin@kuuslauk.ee"

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const previousOrderIdsRef = useRef<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/notification.mp3")
      audio.volume = 1.0
      audio.preload = "auto"
      audioRef.current = audio
      audio.load()
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("kuuslauk-orders")
    if (stored) {
      try {
        const parsedOrders = JSON.parse(stored)
        setOrders(parsedOrders)
        previousOrderIdsRef.current = new Set(parsedOrders.map((o: Order) => o.id))
      } catch {
        setOrders([])
      }
    }
    setIsLoaded(true)
    setTimeout(() => {
      isInitialLoadRef.current = false
    }, 1000)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kuuslauk-orders", JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("[v0] Audio autoplay blocked:", error)
        })
      }
    }
  }, [])

  const clearNewOrderAlert = useCallback(() => {
    setNewOrderAlert(false)
  }, [])

  const sendAdminNotification = async (order: Order) => {
    try {
      await fetch("/api/send-admin-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: ADMIN_EMAIL,
          order: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            items: order.items.map((item) => ({
              name: item.menuItem.name.en,
              quantity: item.quantity,
              price: item.menuItem.price,
              proteinChoice: item.proteinChoice,
              notes: item.notes,
            })),
            total: order.total,
            pickupTime: order.pickupTime,
            paymentMethod: order.paymentMethod,
            notes: order.notes,
          },
        }),
      })
    } catch (error) {
      console.error("[v0] Failed to send admin notification:", error)
    }
  }

  const addOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt">) => {
      const newOrder: Order = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      setNewOrderAlert(true)
      playNotificationSound()

      setOrders((prev) => {
        const updated = [newOrder, ...prev]
        previousOrderIdsRef.current = new Set(updated.map((o) => o.id))
        return updated
      })

      sendAdminNotification(newOrder)
    },
    [playNotificationSound],
  )

  const sendReadyNotification = async (order: Order) => {
    try {
      await fetch("/api/send-ready-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          pickupTime: order.pickupTime,
          location: RESTAURANT_LOCATION,
        }),
      })
    } catch (error) {
      console.error("Failed to send ready notification:", error)
    }
  }

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    const order = orders.find((o) => o.id === id)

    if (status === "ready" && order) {
      sendReadyNotification(order)
    }

    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const getPendingOrders = () => {
    return orders.filter((order) => order.status !== "completed")
  }

  const getCompletedOrders = () => {
    return orders.filter((order) => order.status === "completed")
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getPendingOrders,
        getCompletedOrders,
        newOrderAlert,
        clearNewOrderAlert,
        playNotificationSound,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
