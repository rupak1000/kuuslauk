"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SiteSettings {
  logo: string
  restaurantName: string
  address: string
  phone: string
  email: string
  mapLink: string
}

interface SiteSettingsContextType {
  settings: SiteSettings
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>
  isLoading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

const defaultSettings: SiteSettings = {
  logo: "",
  restaurantName: "KÜÜSLAUK",
  address: "Sadama tn 7, 10111 Tallinn",
  phone: "5424 0020",
  email: "info@kuuslauk.ee",
  mapLink: "https://maps.app.goo.gl/MC6A1CWw34dXzTsk9",
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from Database on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const dbData = await response.json()
          setSettings(dbData)
        } else {
          // Fallback to localStorage if API fails
          const stored = localStorage.getItem("kuuslauk-site-settings")
          if (stored) setSettings(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    const updatedSettings = { ...settings, ...updates }
    
    // Update UI immediately (Optimistic Update)
    setSettings(updatedSettings)
    
    // Save to LocalStorage for persistence
    localStorage.setItem("kuuslauk-site-settings", JSON.stringify(updatedSettings))

    // Save to Database via API
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save to database")
      }
    } catch (error) {
      console.error("Database sync error:", error)
      // Optional: alert user that sync failed
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}