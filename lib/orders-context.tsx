"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  items: any[] 
  total: number
  pickupTime: string
  paymentMethod: "card" | "cash"
  notes?: string
  status: "pending" | "preparing" | "ready" | "completed" | "pending_payment"
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
  mapLink: "https://www.google.com/maps/search/?api=1&query=Sadama+7+Tallinn",
}

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
    }
  }, [])

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log("Audio blocked:", e))
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) return
      
      const data: Order[] = await response.json()
      
      const currentIds = new Set(data.map(o => o.id))
      const hasNewOrder = data.some(o => !previousOrderIdsRef.current.has(o.id))

      if (hasNewOrder && !isInitialLoadRef.current) {
        setNewOrderAlert(true)
        playNotificationSound()
      }

      previousOrderIdsRef.current = currentIds
      setOrders(data)
      setIsLoaded(true)
      isInitialLoadRef.current = false
    } catch (error) {
      console.error("Polling Error:", error)
    }
  }, [playNotificationSound])

  useEffect(() => {
    fetchOrders() 
    const interval = setInterval(fetchOrders, 10000) 
    return () => clearInterval(interval)
  }, [fetchOrders])

  const clearNewOrderAlert = useCallback(() => {
    setNewOrderAlert(false)
  }, [])

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    // 1. Find the order in the current list before we modify anything
    const orderToNotify = orders.find(o => o.id === id)

    // 2. Optimistic UI update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error("Failed to update database")

      // 3. If status is 'ready', trigger the Resend email API
      if (status === "ready" && orderToNotify) {
        await fetch("/api/send-ready-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: orderToNotify.customerEmail,
            customerName: orderToNotify.customerName,
            orderNumber: orderToNotify.orderNumber,
            pickupTime: orderToNotify.pickupTime,
            location: RESTAURANT_LOCATION,
          }),
        })
      }
    } catch (error) {
      console.error("Update failed:", error)
      fetchOrders() // Rollback by fetching fresh data
    }
  }

  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id))
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed on server")
    } catch (error) {
      console.error("Delete failed:", error)
      fetchOrders()
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder: () => {}, 
        updateOrderStatus,
        deleteOrder,
        getPendingOrders: () => orders.filter((o) => o.status !== "completed"),
        getCompletedOrders: () => orders.filter((o) => o.status === "completed"),
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