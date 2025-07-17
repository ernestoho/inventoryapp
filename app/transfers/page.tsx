"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ArrowRightLeft, Eye, Edit, Warehouse, Coffee, ChefHat, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<TransferOrder | null>(null)
  const [form, setForm] = useState<Partial<TransferOrder>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const fetchTransfers = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("transfer_orders").select("id, transfer_number, from_location_id, to_location_id, status, transfer_date, completed_date, created_by")
    if (error) {
      setError(error.message)
      setTransfers([])
    } else {
      setTransfers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  const openCreateModal = () => {
    setEditingTransfer(null)
    setForm({})
    setModalOpen(true)
  }

  const openEditModal = (transfer: TransferOrder) => {
    setEditingTransfer(transfer)
    setForm(transfer)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTransfer(null)
    setForm({})
    setFormError("")
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    if (editingTransfer) {
      // Update
      const { error } = await supabase.from("transfer_orders").update(form).eq("id", editingTransfer.id)
      if (error) setFormError(error.message)
    } else {
      // Create
      const { error } = await supabase.from("transfer_orders").insert([form])
      if (error) setFormError(error.message)
    }
    setFormLoading(false)
    if (!formError) {
      closeModal()
      fetchTransfers()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transfer?")) return
    setLoading(true)
    const { error } = await supabase.from("transfer_orders").delete().eq("id", id)
    if (error) setError(error.message)
    fetchTransfers()
  }

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
        <Button onClick={openCreateModal}>
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
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(transfer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(transfer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransfer ? "Edit Transfer" : "New Transfer"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer_number">Transfer Number</Label>
              <Input id="transfer_number" name="transfer_number" value={form.transfer_number || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_location_id">From Location ID</Label>
              <Input id="from_location_id" name="from_location_id" value={form.from_location_id || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_location_id">To Location ID</Label>
              <Input id="to_location_id" name="to_location_id" value={form.to_location_id || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={form.status || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer_date">Transfer Date</Label>
              <Input id="transfer_date" name="transfer_date" value={form.transfer_date || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completed_date">Completed Date</Label>
              <Input id="completed_date" name="completed_date" value={form.completed_date || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="created_by">Created By</Label>
              <Input id="created_by" name="created_by" value={form.created_by || ""} onChange={handleFormChange} />
            </div>
            {formError && <div className="text-red-500 text-center">{formError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : editingTransfer ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
