"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"

interface DashboardStats {
  totalItems: number
  lowStockItems: number
  totalValue: number
  recentTransactions: number
}

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

const mockStats: DashboardStats = {
  totalItems: 127,
  lowStockItems: 8,
  totalValue: 245680,
  recentTransactions: 23,
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentTransactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setStats(mockStats)
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        // Get total items
        const { count: totalItems } = await supabase
          .from("items")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true)

        // Get low stock items
        const { data: lowStockData } = await supabase.rpc("get_low_stock_items")

        // Get inventory value
        const { data: valueData } = await supabase.rpc("get_inventory_value")
        const totalValue =
          valueData?.reduce((sum: number, item: any) => sum + Number.parseFloat(item.total_value), 0) || 0

        // Get recent transactions (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { count: recentTransactions } = await supabase
          .from("inventory_transactions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString())

        setStats({
          totalItems: totalItems || 0,
          lowStockItems: lowStockData?.length || 0,
          totalValue,
          recentTransactions: recentTransactions || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, () => fetchStats())
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory_transactions" }, () => fetchStats())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockItems.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Inventory Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Recent Activity",
      value: stats.recentTransactions.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
