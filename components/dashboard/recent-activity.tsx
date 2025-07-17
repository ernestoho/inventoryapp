"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  transaction_type: string
  quantity_change: number
  created_at: string
  items: { name: string; sku: string }
  locations: { name: string }
  profiles: { full_name: string | null }
}

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(".supabase.co")

const mockTransactions: Transaction[] = [
  {
    id: "1",
    transaction_type: "purchase",
    quantity_change: 50,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    items: { name: "Business Laptop", sku: "LAPTOP-001" },
    locations: { name: "Main Warehouse" },
    profiles: { full_name: "Demo Admin" },
  },
  {
    id: "2",
    transaction_type: "sale",
    quantity_change: -2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    items: { name: "Office Chair", sku: "CHAIR-001" },
    locations: { name: "Retail Store" },
    profiles: { full_name: "Demo Admin" },
  },
  {
    id: "3",
    transaction_type: "production",
    quantity_change: 10,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    items: { name: "Office Chair", sku: "CHAIR-001" },
    locations: { name: "Production Floor" },
    profiles: { full_name: "Demo Admin" },
  },
  {
    id: "4",
    transaction_type: "adjustment",
    quantity_change: -1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    items: { name: "Industrial Drill", sku: "DRILL-001" },
    locations: { name: "Main Warehouse" },
    profiles: { full_name: "Demo Admin" },
  },
  {
    id: "5",
    transaction_type: "transfer",
    quantity_change: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    items: { name: "Business Tablet", sku: "TABLET-001" },
    locations: { name: "Retail Store" },
    profiles: { full_name: "Demo Admin" },
  },
]

export function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setTransactions(mockTransactions)
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        const { data } = await supabase
          .from("inventory_transactions")
          .select(`
            id,
            transaction_type,
            quantity_change,
            created_at,
            items (name, sku),
            locations (name),
            profiles (full_name)
          `)
          .order("created_at", { ascending: false })
          .limit(10)

        setTransactions(data || [])
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("recent-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "inventory_transactions" }, () =>
        fetchTransactions(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-green-100 text-green-800"
      case "sale":
        return "bg-red-100 text-red-800"
      case "production":
        return "bg-blue-100 text-blue-800"
      case "adjustment":
        return "bg-yellow-100 text-yellow-800"
      case "transfer":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Badge className={getTransactionColor(transaction.transaction_type)}>
                  {transaction.transaction_type}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.items?.name} ({transaction.items?.sku})
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.quantity_change > 0 ? "+" : ""}
                  {transaction.quantity_change} units
                  {" • "}
                  {transaction.locations?.name}
                  {transaction.profiles?.full_name && <span> • by {transaction.profiles.full_name}</span>}
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
