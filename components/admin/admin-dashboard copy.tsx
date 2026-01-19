"use client"

import { useState, useCallback } from "react"
import { useMenuData, type MenuItem } from "@/lib/menu-data"
import { useOffersData, type Offer } from "@/lib/offers-data"
import { useSiteSettings } from "@/lib/site-settings-context"
import { useOrders } from "@/lib/orders-context"
import { useReservations } from "@/lib/reservations-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MenuItemForm } from "@/components/admin/menu-item-form"
import { MenuItemCard } from "@/components/admin/menu-item-card"
import { OfferForm } from "@/components/admin/offer-form"
import { OfferCard } from "@/components/admin/offer-card"
import { OrderCard } from "@/components/admin/order-card"
import { ReservationCard } from "@/components/admin/reservation-card"
import { ImageUpload } from "@/components/admin/image-upload"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  LogOut,
  Utensils,
  Home,
  UtensilsCrossed,
  IceCream,
  Baby,
  Tag,
  Percent,
  Settings,
  ShoppingBag,
  User,
  Bell,
  Volume2,
  CalendarDays,
  Menu,
  X,
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
}

interface AdminDashboardProps {
  onLogout: () => void
  adminUser?: AdminUser
}

const categoryIcons = {
  starters: Utensils,
  wok: UtensilsCrossed,
  kebab: Utensils,
  kids: Baby,
  desserts: IceCream,
}

const categoryLabels = {
  starters: "Starters",
  wok: "Wok Dishes",
  kebab: "Kebab Dishes",
  kids: "Kids Menu",
  desserts: "Desserts",
}

export function AdminDashboard({ onLogout, adminUser }: AdminDashboardProps) {
  const { menuItems, deleteMenuItem } = useMenuData()
  const { offers, deleteOffer } = useOffersData()
  const { settings, updateSettings } = useSiteSettings()
  const { orders, updateOrderStatus, deleteOrder, newOrderAlert, clearNewOrderAlert, playNotificationSound } =
    useOrders()
  const { reservations, updateReservationStatus, deleteReservation, newReservationAlert, clearNewReservationAlert } =
    useReservations()

  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false)
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

  const [deleteMenuConfirm, setDeleteMenuConfirm] = useState<string | null>(null)
  const [deleteOfferConfirm, setDeleteOfferConfirm] = useState<string | null>(null)
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState<string | null>(null)
  const [deleteReservationConfirm, setDeleteReservationConfirm] = useState<string | null>(null)

  const [activeCategory, setActiveCategory] = useState<MenuItem["category"]>("starters")
  const [mainTab, setMainTab] = useState<"orders" | "reservations" | "menu" | "offers" | "settings">("orders")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item)
    setIsMenuFormOpen(true)
  }

  const handleDeleteMenuItem = (id: string) => {
    setDeleteMenuConfirm(id)
  }

  const confirmDeleteMenuItem = () => {
    if (deleteMenuConfirm) {
      deleteMenuItem(deleteMenuConfirm)
      setDeleteMenuConfirm(null)
    }
  }

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer)
    setIsOfferFormOpen(true)
  }

  const handleDeleteOffer = (id: string) => {
    setDeleteOfferConfirm(id)
  }

  const confirmDeleteOffer = () => {
    if (deleteOfferConfirm) {
      deleteOffer(deleteOfferConfirm)
      setDeleteOfferConfirm(null)
    }
  }

  const handleDeleteOrder = (id: string) => {
    setDeleteOrderConfirm(id)
  }

  const confirmDeleteOrder = () => {
    if (deleteOrderConfirm) {
      deleteOrder(deleteOrderConfirm)
      setDeleteOrderConfirm(null)
    }
  }

  const handleDeleteReservation = (id: string) => {
    setDeleteReservationConfirm(id)
  }

  const confirmDeleteReservation = () => {
    if (deleteReservationConfirm) {
      deleteReservation(deleteReservationConfirm)
      setDeleteReservationConfirm(null)
    }
  }

  const handleMenuFormClose = () => {
    setIsMenuFormOpen(false)
    setEditingMenuItem(null)
  }

  const handleOfferFormClose = () => {
    setIsOfferFormOpen(false)
    setEditingOffer(null)
  }

  const handleTestSound = useCallback(() => {
    playNotificationSound()
  }, [playNotificationSound])

  const handleTabChange = (tab: "orders" | "reservations" | "menu" | "offers" | "settings") => {
    setMainTab(tab)
    setMobileMenuOpen(false)
  }

  // ────────────────────────────────────────────────
  // Derived data
  // ────────────────────────────────────────────────

  const filteredMenuItems = menuItems.filter((item) => item.category === activeCategory)

  const getCategoryCount = (category: MenuItem["category"]) =>
    menuItems.filter((item) => item.category === category).length

  const dailyOffers = offers.filter((o) => o.type === "daily")
  const weeklyOffers = offers.filter((o) => o.type === "weekly")

  const pendingOrders = orders.filter((o) => o.status === "pending")
  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const readyOrders = orders.filter((o) => o.status === "ready")
  const completedOrders = orders.filter((o) => o.status === "completed")

  const pendingReservations = reservations.filter((r) => r.status === "pending")
  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const completedReservations = reservations.filter(
    (r) => r.status === "completed" || r.status === "cancelled"
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {(newOrderAlert || newReservationAlert) && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-green-500 text-white py-3 px-4 text-center animate-pulse">
          <div className="flex items-center justify-center gap-3">
            <Bell className="w-5 h-5 animate-bounce" />
            <span className="font-bold text-sm md:text-base">
              {newOrderAlert ? "New Order Received!" : "New Reservation Received!"}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (newOrderAlert) clearNewOrderAlert()
                if (newReservationAlert) clearNewReservationAlert()
              }}
              className="ml-2 md:ml-4 bg-white text-green-600 hover:bg-green-50 text-xs md:text-sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header
        className={`sticky ${newOrderAlert || newReservationAlert ? "top-12" : "top-0"} z-50 bg-white border-b border-gray-200 shadow-sm transition-all`}
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-amber-600">KÜÜSLAUK</h1>
                <p className="text-xs text-gray-500 hidden sm:block">WOK & KEBAB</p>
              </div>
            </div>

            {/* Desktop header buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestSound}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                title="Test notification sound"
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              {adminUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                  <User className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-700">{adminUser.name || adminUser.email}</span>
                </div>
              )}

              <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
                <a href="/">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile header buttons */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestSound}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white p-2"
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 space-y-2">
              {adminUser && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg mb-3">
                  <User className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-700">{adminUser.name || adminUser.email}</span>
                </div>
              )}
              <a href="/" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Home className="w-4 h-4" />
                View Site
              </a>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          <Button
            variant={mainTab === "orders" ? "default" : "outline"}
            onClick={() => handleTabChange("orders")}
            className={`relative flex-shrink-0 text-xs md:text-sm min-w-[110px] ${
              mainTab === "orders"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4 mr-1 md:mr-2" />
            Orders ({orders.filter((o) => o.status !== "completed").length})
            {newOrderAlert && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-bounce">
                !
              </span>
            )}
          </Button>

          <Button
            variant={mainTab === "reservations" ? "default" : "outline"}
            onClick={() => handleTabChange("reservations")}
            className={`relative flex-shrink-0 text-xs md:text-sm min-w-[130px] ${
              mainTab === "reservations"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
            }`}
          >
            <CalendarDays className="w-4 h-4 mr-1 md:mr-2" />
            Reservations (
            {reservations.filter((r) => r.status === "pending" || r.status === "confirmed").length})
            {newReservationAlert && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-bounce">
                !
              </span>
            )}
          </Button>

          <Button
            variant={mainTab === "menu" ? "default" : "outline"}
            onClick={() => handleTabChange("menu")}
            className={`flex-shrink-0 text-xs md:text-sm min-w-[100px] ${
              mainTab === "menu"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
            }`}
          >
            <Utensils className="w-4 h-4 mr-1 md:mr-2" />
            Menu ({menuItems.length})
          </Button>

          <Button
            variant={mainTab === "offers" ? "default" : "outline"}
            onClick={() => handleTabChange("offers")}
            className={`flex-shrink-0 text-xs md:text-sm min-w-[100px] ${
              mainTab === "offers"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
            }`}
          >
            <Percent className="w-4 h-4 mr-1 md:mr-2" />
            Offers ({offers.length})
          </Button>

          <Button
            variant={mainTab === "settings" ? "default" : "outline"}
            onClick={() => handleTabChange("settings")}
            className={`flex-shrink-0 text-xs md:text-sm min-w-[100px] ${
              mainTab === "settings"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
            }`}
          >
            <Settings className="w-4 h-4 mr-1 md:mr-2" />
            Settings
          </Button>
        </div>

        {/* ORDERS TAB */}
        {mainTab === "orders" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="border-yellow-300 bg-yellow-50">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Pending</p>
                </CardContent>
              </Card>
              <Card className="border-blue-300 bg-blue-50">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{preparingOrders.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Preparing</p>
                </CardContent>
              </Card>
              <Card className="border-green-300 bg-green-50">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-green-600">{readyOrders.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Ready</p>
                </CardContent>
              </Card>
              <Card className="border-gray-300 bg-gray-100">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-600">{completedOrders.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl">Active Orders</CardTitle>
                <CardDescription className="text-gray-500 text-sm">Manage incoming customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.filter((o) => o.status !== "completed").length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <ShoppingBag className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">No active orders at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders
                      .filter((o) => o.status !== "completed")
                      .map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                          onDelete={() => handleDeleteOrder(order.id)}
                        />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {completedOrders.length > 0 && (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-gray-900 text-lg md:text-xl">Completed Orders</CardTitle>
                  <CardDescription className="text-gray-500 text-sm">Orders that have been picked up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                        onDelete={() => handleDeleteOrder(order.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {mainTab === "reservations" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="border-yellow-300 bg-yellow-50">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingReservations.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Pending</p>
                </CardContent>
              </Card>
              <Card className="border-blue-300 bg-blue-50">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{confirmedReservations.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Confirmed</p>
                </CardContent>
              </Card>
              <Card className="border-gray-300 bg-gray-100">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-600">{completedReservations.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Past</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl">Active Reservations</CardTitle>
                <CardDescription className="text-gray-500 text-sm">Manage incoming table reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {reservations.filter((r) => r.status === "pending" || r.status === "confirmed").length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <CalendarDays className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">No active reservations at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservations
                      .filter((r) => r.status === "pending" || r.status === "confirmed")
                      .map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          reservation={reservation}
                          onUpdateStatus={(status) => updateReservationStatus(reservation.id, status)}
                          onDelete={() => handleDeleteReservation(reservation.id)}
                        />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {completedReservations.length > 0 && (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-gray-900 text-lg md:text-xl">Past Reservations</CardTitle>
                  <CardDescription className="text-gray-500 text-sm">
                    Completed and cancelled reservations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedReservations.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onUpdateStatus={(status) => updateReservationStatus(reservation.id, status)}
                        onDelete={() => handleDeleteReservation(reservation.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* MENU TAB */}
        {mainTab === "menu" && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((category) => {
                const Icon = categoryIcons[category]
                return (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 text-xs md:text-sm min-w-[140px] ${
                      activeCategory === category
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1 md:mr-2" />
                    {categoryLabels[category]} ({getCategoryCount(category)})
                  </Button>
                )
              })}
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-gray-900 text-lg md:text-xl">
                      {categoryLabels[activeCategory]}
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                      {getCategoryCount(activeCategory)} items in this category
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsMenuFormOpen(true)}
                    className="bg-amber-600 text-white hover:bg-amber-700 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMenuItems.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <Utensils className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">No items in this category yet.</p>
                    <Button
                      onClick={() => setIsMenuFormOpen(true)}
                      variant="outline"
                      className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMenuItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEditMenuItem}
                        onDelete={() => handleDeleteMenuItem(item.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* OFFERS TAB */}
        {mainTab === "offers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Special Offers</h2>
              <Button
                onClick={() => setIsOfferFormOpen(true)}
                className="bg-amber-600 text-white hover:bg-amber-700 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Offer
              </Button>
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-600" />
                  Daily Offers ({dailyOffers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyOffers.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 md:py-8 text-sm md:text-base">No daily offers yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dailyOffers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onEdit={() => handleEditOffer(offer)}           // ← FIXED
                        onDelete={() => handleDeleteOffer(offer.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl flex items-center gap-2">
                  <Percent className="w-5 h-5 text-amber-600" />
                  Weekly Offers ({weeklyOffers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyOffers.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 md:py-8 text-sm md:text-base">No weekly offers yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeklyOffers.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onEdit={() => handleEditOffer(offer)}           // ← FIXED
                        onDelete={() => handleDeleteOffer(offer.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* SETTINGS TAB */}
        {mainTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Site Settings</h2>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl">Logo</CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  Upload your restaurant logo to display on the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <ImageUpload
                    value={settings.logo}
                    onChange={(url) => updateSettings({ logo: url })}
                    label="Restaurant Logo"
                    placeholder="restaurant logo"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* MODALS / DIALOGS */}
      {isMenuFormOpen && (
        <MenuItemForm
          item={editingMenuItem}
          defaultCategory={activeCategory}
          onClose={handleMenuFormClose}
        />
      )}

      {isOfferFormOpen && <OfferForm offer={editingOffer} onClose={handleOfferFormClose} />}

      <AlertDialog open={!!deleteMenuConfirm} onOpenChange={() => setDeleteMenuConfirm(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Are you sure you want to delete this menu item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMenuItem}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteOfferConfirm} onOpenChange={() => setDeleteOfferConfirm(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Offer</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Are you sure you want to delete this offer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteOffer}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteOrderConfirm} onOpenChange={() => setDeleteOrderConfirm(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Order</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteOrder}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteReservationConfirm}
        onOpenChange={() => setDeleteReservationConfirm(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Reservation</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Are you sure you want to delete this reservation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteReservation}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}