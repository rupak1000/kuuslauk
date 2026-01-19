"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { MenuItem } from "@/lib/menu-data"

const proteinExtraPrices: Record<string, number> = {
  chicken: 0,
  beef: 0,
  pork: 0,
  shrimp: 2,
  tofu: 0,
}

export function getProteinExtraPrice(proteinChoice?: string): number {
  if (!proteinChoice) return 0
  return proteinExtraPrices[proteinChoice] || 0
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  notes?: string
  proteinChoice?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (menuItem: MenuItem, quantity?: number, notes?: string, proteinChoice?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("kuuslauk-cart")
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        setItems([])
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kuuslauk-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (menuItem: MenuItem, quantity = 1, notes?: string, proteinChoice?: string) => {
    const existingItem = items.find(
      (item) => item.menuItem.id === menuItem.id && item.proteinChoice === proteinChoice && item.notes === notes,
    )

    if (existingItem) {
      setItems((prev) =>
        prev.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item)),
      )
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        menuItem,
        quantity,
        notes,
        proteinChoice,
      }
      setItems((prev) => [...prev, newItem])
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((total, item) => {
      const proteinExtra = getProteinExtraPrice(item.proteinChoice)
      return total + (item.menuItem.price + proteinExtra) * item.quantity
    }, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
