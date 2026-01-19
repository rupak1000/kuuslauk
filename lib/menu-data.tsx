"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface MenuItem {
  id: string
  name: {
    en: string
    et: string
    ru: string
  }
  description?: {
    en: string
    et: string
    ru: string
  }
  price: number
  category: "starters" | "wok" | "kebab" | "kids" | "desserts"
  image: string
  spicy?: boolean
  extraSpicy?: boolean
  vegan?: boolean
  isActive?: boolean
  sortOrder?: number
}

interface MenuDataContextType {
  menuItems: MenuItem[]
  isLoading: boolean
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>
  getItemsByCategory: (category: MenuItem["category"]) => MenuItem[]
  refreshMenu: () => Promise<void>
}

const MenuDataContext = createContext<MenuDataContextType | undefined>(undefined)

export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. GET - Fetch all menu items
  const fetchMenu = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/menu?active=false")
      if (!response.ok) throw new Error("Failed to fetch menu items")
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error("Error loading menu from DB:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  // 2. POST - Add new item
  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setMenuItems((prev) => [...prev, newItem])
      } else {
        const err = await response.json()
        console.error("Create failed:", err.error)
      }
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  // 3. PUT - Update existing item
  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setMenuItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        )
      } else {
        console.error("Update failed")
      }
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  // 4. DELETE - Delete item
  const deleteMenuItem = async (id: string) => {
    if (!id) {
      console.error("Delete Error: No ID provided to deleteMenuItem function")
      return
    }

    try {
      console.log(`Attempting to delete item: ${id}`)
      
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Optimistically remove from state
        setMenuItems((prev) => prev.filter((item) => item.id !== id))
        console.log(`Successfully deleted item: ${id}`)
      } else {
        // Log the actual error from the API for debugging
        const errorData = await response.json().catch(() => ({}))
        console.error("Server Delete Error:", response.status, errorData)
        alert(`Delete failed: ${errorData.error || 'Server error'}`)
      }
    } catch (error) {
      console.error("Network error during delete:", error)
      alert("Network error. Please check your connection.")
    }
  }

  const getItemsByCategory = (category: MenuItem["category"]) => {
    return menuItems.filter((item) => item.category === category)
  }

  return (
    <MenuDataContext.Provider
      value={{
        menuItems,
        isLoading,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getItemsByCategory,
        refreshMenu: fetchMenu,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  )
}

export function useMenuData() {
  const context = useContext(MenuDataContext)
  if (!context) {
    throw new Error("useMenuData must be used within a MenuDataProvider")
  }
  return context
}