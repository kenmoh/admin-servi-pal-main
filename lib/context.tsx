"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Order, User, Vendor, Wallet, Notification } from "./types"
import { DeliveryOrderSummary } from "@/types/delivery-types"
import { FoodOrderSummary } from "@/types/restaurant-types"
import { LaundryOrderSummary } from "@/types/laundry-types"
import { ProductOrderSummary } from "@/types/product-types"
import { ProfileSummary } from "@/types/user-types"


interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  notifications: Notification[]
  unreadCount: number
  markNotificationAsRead: (id: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  selectedOrder: Order | null
  setSelectedOrder: (order: Order | null) => void
  selectedDelivery: DeliveryOrderSummary | null
  setSelectedDelivery: (delivery: DeliveryOrderSummary | null) => void
  selectedVendor: Vendor | null
  setSelectedVendor: (vendor: Vendor | null) => void
  selectedFoodOrder: FoodOrderSummary | null
  setSelectedFoodOrder: (order: FoodOrderSummary | null) => void
  selectedLaundryOrder: LaundryOrderSummary | null
  setSelectedLaundryOrder: (order: LaundryOrderSummary | null) => void
  selectedProductOrder: ProductOrderSummary | null
  setSelectedProductOrder: (order: ProductOrderSummary | null) => void
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  selectedWallet: Wallet | null
  setSelectedWallet: (wallet: Wallet | null) => void
  selectedProfile: ProfileSummary | null
  setSelectedProfile: (profile: ProfileSummary | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setThemeState] = useState<"light" | "dark">("dark")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrderSummary | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedFoodOrder, setSelectedFoodOrder] = useState<FoodOrderSummary | null>(null)
  const [selectedLaundryOrder, setSelectedLaundryOrder] = useState<LaundryOrderSummary | null>(null)
  const [selectedProductOrder, setSelectedProductOrder] = useState<ProductOrderSummary | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<ProfileSummary | null>(null)

  useEffect(() => {
    const savedTheme = localStorage?.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setThemeState(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme)
    localStorage?.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        notifications,
        unreadCount,
        markNotificationAsRead,
        sidebarOpen,
        setSidebarOpen,
        theme,
        setTheme,
        selectedOrder,
        setSelectedOrder,
        selectedDelivery,
        setSelectedDelivery,
        selectedVendor,
        setSelectedVendor,
        selectedFoodOrder,
        setSelectedFoodOrder,
        selectedLaundryOrder,
        setSelectedLaundryOrder,
        selectedProductOrder,
        setSelectedProductOrder,
        selectedUser,
        setSelectedUser,
        selectedWallet,
        setSelectedWallet,
        selectedProfile,
        setSelectedProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
