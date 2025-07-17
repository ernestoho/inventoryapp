"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  title: string
}

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(".supabase.co")

const mockNotifications = [
  { item_name: "Business Laptop", location_name: "Main Warehouse", current_stock: 8 },
  { item_name: "Office Chair", location_name: "Main Warehouse", current_stock: 5 },
  { item_name: "Industrial Drill", location_name: "Main Warehouse", current_stock: 2 },
]

export function Header({ title }: HeaderProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isDemoMode) {
      setNotifications(mockNotifications)
      return
    }

    // Fetch low stock notifications
    const fetchNotifications = async () => {
      const { data } = await supabase.rpc("get_low_stock_items")
      if (data) {
        setNotifications(data.slice(0, 5)) // Show only first 5
      }
    }

    fetchNotifications()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("inventory-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, () => fetchNotifications())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search items, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10"
          />
        </div>

        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Demo Mode
          </Badge>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {notifications.length === 0 ? (
              <DropdownMenuItem>No notifications</DropdownMenuItem>
            ) : (
              notifications.map((item, index) => (
                <DropdownMenuItem key={index}>
                  <div className="flex flex-col">
                    <span className="font-medium">Low Stock Alert</span>
                    <span className="text-sm text-gray-500">
                      {item.item_name} at {item.location_name}: {item.current_stock} remaining
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
