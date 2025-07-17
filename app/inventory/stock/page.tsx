"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, Package, ArrowUpDown } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"

interface StockLevel {
  id: string
  item_name: string
  sku: string
  location_name: string
  location_type: string
  current_stock: number
  reorder_point: number
  unit_of_measure: string
  batch_number?: string
  expiry_date?: string
  status: "normal" | "low" | "critical" | "expired"
}

export default function StockPage() {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true)
      setError("")
      // Fetch inventory with item and location details
      const { data, error } = await supabase
        .from("inventory")
        .select(`id, quantity:quantity, batch_number, expiry_date, item:items(id, name, sku, unit_of_measure, reorder_point), location:locations(id, name, location_type)`)
      if (error) {
        setError(error.message)
        setStockLevels([])
      } else {
        // Map data to StockLevel interface
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          item_name: row.item?.name || "",
          sku: row.item?.sku || "",
          location_name: row.location?.name || "",
          location_type: row.location?.location_type || "",
          current_stock: row.quantity,
          reorder_point: row.item?.reorder_point || 0,
          unit_of_measure: row.item?.unit_of_measure || "",
          batch_number: row.batch_number,
          expiry_date: row.expiry_date,
          status: (() => {
            if (row.expiry_date && new Date(row.expiry_date) < new Date()) return "expired"
            if (row.quantity <= 0) return "critical"
            if (row.quantity <= (row.item?.reorder_point || 0)) return "low"
            return "normal"
          })(),
        }))
        setStockLevels(mapped)
      }
      setLoading(false)
    }
    fetchStock()
  }, [])

  const filteredStock = stockLevels.filter((stock) => {
    const matchesSearch =
      stock.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.location_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = locationFilter === "all" || stock.location_type === locationFilter
    const matchesStatus = statusFilter === "all" || stock.status === statusFilter

    return matchesSearch && matchesLocation && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getLocationBadge = (type: string) => {
    switch (type) {
      case "storage":
        return <Badge className="bg-blue-100 text-blue-800">Storage</Badge>
      case "bar":
        return <Badge className="bg-purple-100 text-purple-800">Bar</Badge>
      case "kitchen":
        return <Badge className="bg-green-100 text-green-800">Kitchen</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Levels</h1>
          <p className="text-gray-600">Monitor inventory across all locations</p>
        </div>
        <Button>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Transfer Stock
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search items or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="bar">Bars</SelectItem>
            <SelectItem value="kitchen">Kitchens</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Current Stock Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading ? (
            <div className="text-center py-8">Loading stock levels...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Batch/Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{stock.item_name}</div>
                        <div className="text-sm text-gray-500">{stock.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{stock.location_name}</span>
                        {getLocationBadge(stock.location_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stock.current_stock}</span>
                        <span className="text-sm text-gray-500">{stock.unit_of_measure}</span>
                        {stock.current_stock <= stock.reorder_point && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{stock.reorder_point}</TableCell>
                    <TableCell>
                      {stock.batch_number && (
                        <div className="text-sm">
                          <div>Batch: {stock.batch_number}</div>
                          {stock.expiry_date && <div className="text-gray-500">Exp: {stock.expiry_date}</div>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(stock.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Transfer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
