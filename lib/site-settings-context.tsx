"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SiteSettings {
  logo: string
  restaurantName: string
}

interface SiteSettingsContextType {
  settings: SiteSettings
  updateSettings: (updates: Partial<SiteSettings>) => void
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

const defaultSettings: SiteSettings = {
  logo: "",
  restaurantName: "KÜÜSLAUK",
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("kuuslauk-site-settings")
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
      } catch {
        setSettings(defaultSettings)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kuuslauk-site-settings", JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return <SiteSettingsContext.Provider value={{ settings, updateSettings }}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
