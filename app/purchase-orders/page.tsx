"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ShoppingCart, Eye, Edit } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"

interface PurchaseOrder {
  id: string
  po_number: string
  supplier_name: string
  location_name: string
  status: "draft" | "pending" | "approved" | "ordered" | "received" | "cancelled"
  order_date: string
  expected_date: string
  total_amount: number
  currency: string
  items_count: number
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    po_number: "PO-2024-001",
    supplier_name: "Distribuidora de Licores SA",
    location_name: "Amazon Bebidas",
    status: "pending",
    order_date: "2024-02-15",
    expected_date: "2024-02-22",
    total_amount: 16000.0,
    currency: "USD",
    items_count: 3,
  },
  {
    id: "2",
    po_number: "PO-2024-002",
    supplier_name: "Refrescos y Bebidas Ltda",
    location_name: "Amazon Bebidas",
    status: "received",
    order_date: "2024-02-10",
    expected_date: "2024-02-13",
    total_amount: 4500.0,
    currency: "USD",
    items_count: 5,
  },
  {
    id: "3",
    po_number: "PO-2024-003",
    supplier_name: "Alimentos Frescos",
    location_name: "Amazon Comida",
    status: "approved",
    order_date: "2024-02-14",
    expected_date: "2024-02-16",
    total_amount: 2800.0,
    currency: "USD",
    items_count: 8,
  },
  {
    id: "4",
    po_number: "PO-2024-004",
    supplier_name: "Desechables del Caribe",
    location_name: "Amazon Desechables",
    status: "draft",
    order_date: "2024-02-16",
    expected_date: "2024-02-21",
    total_amount: 1200.0,
    currency: "USD",
    items_count: 4,
  },
]

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockPurchaseOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.po_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
      case "ordered":
        return <Badge className="bg-purple-100 text-purple-800">Ordered</Badge>
      case "received":
        return <Badge className="bg-green-100 text-green-800">Received</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-600">Manage orders from suppliers to Amazon storage</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading purchase orders...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.po_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.supplier_name}</div>
                        <div className="text-sm text-gray-500">{order.items_count} items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">{order.location_name}</Badge>
                    </TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.expected_date}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${order.total_amount.toLocaleString()} {order.currency}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
