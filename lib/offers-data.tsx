"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

export interface Offer {
  id: string
  title: {
    en: string
    et: string
    ru: string
  }
  description: {
    en: string
    et: string
    ru: string
  }
  originalPrice: number
  discountPrice: number
  type: "daily" | "weekly"
  validFrom: string
  validUntil: string
  image: string
  isActive: boolean
}

interface OffersDataContextType {
  offers: Offer[]
  isLoading: boolean
  addOffer: (offer: Omit<Offer, "id">) => Promise<void>
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>
  deleteOffer: (id: string) => Promise<void>
  refreshOffers: () => Promise<void>
  getActiveOffers: () => Offer[]
  getDailyOffers: () => Offer[]
  getWeeklyOffers: () => Offer[]
}

const OffersDataContext = createContext<OffersDataContextType | undefined>(undefined)

export function OffersDataProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. Fetch offers from the Database API
  const fetchOffers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/offers")
      if (!response.ok) throw new Error("Failed to fetch offers")
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error("Error loading offers:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  // 2. Add Offer to Database
  const addOffer = async (newOfferData: Omit<Offer, "id">) => {
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOfferData),
      })
      if (response.ok) {
        const savedOffer = await response.json()
        setOffers((prev) => [...prev, savedOffer])
      }
    } catch (error) {
      console.error("Error adding offer:", error)
    }
  }

  // 3. Update Offer in Database
  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        setOffers((prev) =>
          prev.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer))
        )
      }
    } catch (error) {
      console.error("Error updating offer:", error)
    }
  }

  // 4. Delete Offer from Database
  const deleteOffer = async (id: string) => {
    try {
      const response = await fetch(`/api/offers/${id}`, { method: "DELETE" })
      if (response.ok) {
        setOffers((prev) => prev.filter((offer) => offer.id !== id))
      }
    } catch (error) {
      console.error("Error deleting offer:", error)
    }
  }

  // Helper functions for filtering
  const getActiveOffers = useCallback(() => {
    const now = new Date()
    return offers.filter((offer) => {
      const validFrom = new Date(offer.validFrom)
      const validUntil = new Date(offer.validUntil)
      return offer.isActive && now >= validFrom && now <= validUntil
    })
  }, [offers])

  const getDailyOffers = useCallback(() => {
    return getActiveOffers().filter((offer) => offer.type === "daily")
  }, [getActiveOffers])

  const getWeeklyOffers = useCallback(() => {
    return getActiveOffers().filter((offer) => offer.type === "weekly")
  }, [getActiveOffers])

  return (
    <OffersDataContext.Provider
      value={{
        offers,
        isLoading,
        addOffer,
        updateOffer,
        deleteOffer,
        refreshOffers: fetchOffers,
        getActiveOffers,
        getDailyOffers,
        getWeeklyOffers,
      }}
    >
      {children}
    </OffersDataContext.Provider>
  )
}

export function useOffersData() {
  const context = useContext(OffersDataContext)
  if (!context) {
    throw new Error("useOffersData must be used within an OffersDataProvider")
  }
  return context
}