"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ArrowRightLeft, Eye, Edit, Warehouse, Coffee, ChefHat } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"

interface TransferOrder {
  id: string
  transfer_number: string
  from_location: string
  from_type: string
  to_location: string
  to_type: string
  status: "pending" | "in_transit" | "completed" | "cancelled"
  transfer_date: string
  completed_date?: string
  items_count: number
  total_quantity: number
  created_by: string
}

const mockTransferOrders: TransferOrder[] = [
  {
    id: "1",
    transfer_number: "TR-2024-001",
    from_location: "Amazon Bebidas",
    from_type: "storage",
    to_location: "Bar Principal",
    to_type: "bar",
    status: "completed",
    transfer_date: "2024-02-16",
    completed_date: "2024-02-16",
    items_count: 5,
    total_quantity: 48,
    created_by: "Carlos",
  },
  {
    id: "2",
    transfer_number: "TR-2024-002",
    from_location: "Amazon Comida",
    from_type: "storage",
    to_location: "Cocina Principal",
    to_type: "kitchen",
    status: "in_transit",
    transfer_date: "2024-02-16",
    items_count: 8,
    total_quantity: 25,
    created_by: "Maria",
  },
  {
    id: "3",
    transfer_number: "TR-2024-003",
    from_location: "Amazon Desechables",
    from_type: "storage",
    to_location: "Bar Terraza",
    to_type: "bar",
    status: "pending",
    transfer_date: "2024-02-17",
    items_count: 3,
    total_quantity: 500,
    created_by: "Luis",
  },
  {
    id: "4",
    transfer_number: "TR-2024-004",
    from_location: "Bar Principal",
    from_type: "bar",
    to_location: "Bar Terraza",
    to_type: "bar",
    status: "completed",
    transfer_date: "2024-02-15",
    completed_date: "2024-02-15",
    items_count: 2,
    total_quantity: 12,
    created_by: "Ana",
  },
]

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setTransfers(mockTransferOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.transfer_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.from_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.to_location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "storage":
        return <Warehouse className="h-4 w-4 text-blue-600" />
      case "bar":
        return <Coffee className="h-4 w-4 text-purple-600" />
      case "kitchen":
        return <ChefHat className="h-4 w-4 text-green-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Traspasos (Transfers)</h1>
          <p className="text-gray-600">Move inventory between Amazon storage and operational locations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ArrowRightLeft className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold">{transfers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{transfers.filter((t) => t.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold">{transfers.filter((t) => t.status === "in_transit").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{transfers.filter((t) => t.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search transfers..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRightLeft className="mr-2 h-5 w-5" />
            Transfer Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading transfers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>From Location</TableHead>
                  <TableHead>To Location</TableHead>
                  <TableHead>Transfer Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-mono">{transfer.transfer_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(transfer.from_type)}
                        <span>{transfer.from_location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(transfer.to_type)}
                        <span>{transfer.to_location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{transfer.transfer_date}</div>
                        {transfer.completed_date && (
                          <div className="text-gray-500">Completed: {transfer.completed_date}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transfer.items_count} items</Badge>
                    </TableCell>
                    <TableCell>{transfer.total_quantity} units</TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>{transfer.created_by}</TableCell>
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
