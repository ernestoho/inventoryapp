"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { AlertTriangle, Package } from "lucide-react"
import Link from "next/link"

interface LowStockItem {
  item_id: string
  item_name: string
  sku: string
  location_id: string
  location_name: string
  current_stock: number
  reorder_point: number
  preferred_supplier_name: string | null
}

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(".supabase.co")

const mockLowStockItems: LowStockItem[] = [
  {
    item_id: "1",
    item_name: "Business Laptop",
    sku: "LAPTOP-001",
    location_id: "1",
    location_name: "Main Warehouse",
    current_stock: 8,
    reorder_point: 10,
    preferred_supplier_name: "TechCorp Solutions",
  },
  {
    item_id: "2",
    item_name: "Office Chair",
    sku: "CHAIR-001",
    location_id: "1",
    location_name: "Main Warehouse",
    current_stock: 5,
    reorder_point: 8,
    preferred_supplier_name: "Global Furniture Ltd",
  },
  {
    item_id: "3",
    item_name: "Industrial Drill",
    sku: "DRILL-001",
    location_id: "1",
    location_name: "Main Warehouse",
    current_stock: 2,
    reorder_point: 3,
    preferred_supplier_name: "Precision Tools Inc",
  },
]

export function LowStockAlerts() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setLowStockItems(mockLowStockItems)
      setLoading(false)
      return
    }

    const fetchLowStockItems = async () => {
      try {
        const { data } = await supabase.rpc("get_low_stock_items")
        setLowStockItems(data || [])
      } catch (error) {
        console.error("Error fetching low stock items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLowStockItems()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("low-stock-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, () => fetchLowStockItems())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
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
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          Low Stock Alerts
          <Badge variant="destructive" className="ml-2">
            {lowStockItems.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No low stock alerts</h3>
            <p className="mt-1 text-sm text-gray-500">All items are adequately stocked.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={`${item.item_id}-${item.location_id}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">{item.item_name}</h4>
                    <Badge variant="outline" className="ml-2">
                      {item.sku}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.location_name} • {item.current_stock} remaining (reorder at {item.reorder_point})
                  </p>
                  {item.preferred_supplier_name && (
                    <p className="text-xs text-gray-400 mt-1">Supplier: {item.preferred_supplier_name}</p>
                  )}
                </div>
                <Button size="sm" asChild>
                  <Link href={`/purchase-orders/new?item=${item.item_id}`}>Reorder</Link>
                </Button>
              </div>
            ))}
            {lowStockItems.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" asChild>
                  <Link href="/inventory/stock?filter=low">View All ({lowStockItems.length})</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
