"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  menu?: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
}

interface ReservationsContextType {
  reservations: Reservation[]
  loading: boolean
  addReservation: (data: Omit<Reservation, "id" | "status" | "createdAt">) => Promise<void>
  updateReservationStatus: (id: string, status: Reservation["status"]) => Promise<void>
  deleteReservation: (id: string) => Promise<void>
  newReservationAlert: boolean
  clearNewReservationAlert: () => void
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined)

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [newReservationAlert, setNewReservationAlert] = useState(false)

  const isMounted = useRef(true)
  const isSubmitting = useRef(false)

  const fetchReservations = useCallback(async () => {
    if (!isMounted.current) return

    try {
      setLoading(true)
      const res = await fetch("/api/reservations", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      if (!Array.isArray(data)) throw new Error("Expected array")

      const formatted = data.map((r: any) => ({
        ...r,
        id: String(r.id),
        createdAt: r.created_at ?? r.createdAt,
      }))

      if (isMounted.current) {
        setReservations(formatted)
      }
    } catch (err) {
      console.error("Failed to load reservations:", err)
      if (isMounted.current) setReservations([])
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    fetchReservations()

    return () => {
      isMounted.current = false
    }
  }, [fetchReservations])

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/notification.mp3")
      audio.volume = 0.4
      audio.play().catch(() => {
        // fallback beep
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
        osc.start()
        osc.stop(ctx.currentTime + 0.6)
      })
    } catch {}
  }, [])

  const addReservation = useCallback(
    async (reservationData: Omit<Reservation, "id" | "status" | "createdAt">) => {
      if (isSubmitting.current) return
      isSubmitting.current = true

      try {
        const res = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail ?? "Failed to create reservation")
        }

        const { reservation } = await res.json()

        if (reservation && isMounted.current) {
          setReservations((prev) => [reservation, ...prev])
          setNewReservationAlert(true)
          playNotificationSound()
        }
      } catch (err) {
        console.error("Add reservation failed:", err)
        // Optionally: throw so form can show error
      } finally {
        isSubmitting.current = false
      }
    },
    [playNotificationSound]
  )

  const updateReservationStatus = useCallback(async (id: string, status: Reservation["status"]) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Update failed")

      const { reservation } = await res.json()

      if (reservation) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: reservation.status } : r))
        )
      }
    } catch (err) {
      console.error("Status update failed:", err)
    }
  }, [])

  const deleteReservation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      setReservations((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }, [])

  return (
    <ReservationsContext.Provider
      value={{
        reservations,
        loading,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        newReservationAlert,
        clearNewReservationAlert: () => setNewReservationAlert(false),
      }}
    >
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) {
    throw new Error("useReservations must be used inside ReservationsProvider")
  }
  return ctx
}