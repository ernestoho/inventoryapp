"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Receipt, Eye, Coffee, Utensils } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"

interface Sale {
  id: string
  sale_number: string
  customer_name?: string
  location_name: string
  table_number?: string
  server_name: string
  sale_date: string
  total_amount: number
  payment_method: string
  items_count: number
  status: "completed" | "pending" | "cancelled"
}

const mockSales: Sale[] = [
  {
    id: "1",
    sale_number: "SALE-2024-001",
    customer_name: "Mesa 5",
    location_name: "Bar Principal",
    table_number: "5",
    server_name: "Carlos",
    sale_date: "2024-02-16 19:30",
    total_amount: 45.5,
    payment_method: "cash",
    items_count: 3,
    status: "completed",
  },
  {
    id: "2",
    sale_number: "SALE-2024-002",
    customer_name: "Mesa 12",
    location_name: "Bar Terraza",
    table_number: "12",
    server_name: "Maria",
    sale_date: "2024-02-16 20:15",
    total_amount: 78.0,
    payment_method: "card",
    items_count: 5,
    status: "completed",
  },
  {
    id: "3",
    sale_number: "SALE-2024-003",
    location_name: "Bar Principal",
    table_number: "8",
    server_name: "Luis",
    sale_date: "2024-02-16 21:00",
    total_amount: 32.25,
    payment_method: "cash",
    items_count: 2,
    status: "pending",
  },
  {
    id: "4",
    sale_number: "SALE-2024-004",
    customer_name: "Mesa 3",
    location_name: "Bar Terraza",
    table_number: "3",
    server_name: "Ana",
    sale_date: "2024-02-16 18:45",
    total_amount: 125.75,
    payment_method: "card",
    items_count: 8,
    status: "completed",
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true)
      setError("")
      const { data, error } = await supabase.from("sales").select("id, sale_number, customer_name, location_id, sale_date, total_amount, payment_method, table_number, server_name, items_count, status")
      if (error) {
        setError(error.message)
        setSales([])
      } else {
        setSales(data || [])
      }
      setLoading(false)
    }
    fetchSales()
  }, [])

  const filteredSales = sales.filter(
    (sale) =>
      sale.sale_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.server_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.table_number?.includes(searchQuery),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLocationIcon = (location: string) => {
    if (location.includes("Bar")) {
      return <Coffee className="h-4 w-4 text-purple-600" />
    }
    return <Utensils className="h-4 w-4 text-green-600" />
  }

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Cash</Badge>
      case "card":
        return <Badge className="bg-blue-100 text-blue-800">Card</Badge>
      default:
        return <Badge variant="secondary">{method}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-gray-600">Track sales from bars and kitchens</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold">$281.50</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Coffee className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bar Sales</p>
                <p className="text-2xl font-bold">$203.25</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kitchen Sales</p>
                <p className="text-2xl font-bold">$78.25</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search sales, tables, servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Recent Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading sales...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale #</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Table/Customer</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono">{sale.sale_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(sale.location_name)}
                        <span>{sale.location_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {sale.customer_name && <div className="font-medium">{sale.customer_name}</div>}
                        {sale.table_number && <div className="text-sm text-gray-500">Table {sale.table_number}</div>}
                      </div>
                    </TableCell>
                    <TableCell>{sale.server_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sale.sale_date.split(" ")[0]}</div>
                        <div className="text-gray-500">{sale.sale_date.split(" ")[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.items_count} items</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${sale.total_amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>{getPaymentBadge(sale.payment_method)}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
