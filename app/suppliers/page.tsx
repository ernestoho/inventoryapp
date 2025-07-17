"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Truck, Phone, Mail, Edit, Eye, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Supplier {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  currency: string
  payment_terms: number
  lead_time_days: number
  is_active: boolean
  total_orders: number
  total_value: number
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Distribuidora de Licores SA",
    contact_person: "Carlos Mendez",
    email: "carlos@licores.com",
    phone: "+1-555-0101",
    address: "Zona Industrial",
    city: "Ciudad",
    country: "País",
    currency: "USD",
    payment_terms: 30,
    lead_time_days: 7,
    is_active: true,
    total_orders: 24,
    total_value: 125680.5,
  },
  {
    id: "2",
    name: "Refrescos y Bebidas Ltda",
    contact_person: "Maria Rodriguez",
    email: "maria@refrescos.com",
    phone: "+1-555-0102",
    address: "Av. Principal 123",
    city: "Ciudad",
    country: "País",
    currency: "USD",
    payment_terms: 15,
    lead_time_days: 3,
    is_active: true,
    total_orders: 18,
    total_value: 45230.75,
  },
  {
    id: "3",
    name: "Alimentos Frescos",
    contact_person: "Juan Perez",
    email: "juan@alimentos.com",
    phone: "+1-555-0103",
    address: "Mercado Central",
    city: "Ciudad",
    country: "País",
    currency: "USD",
    payment_terms: 7,
    lead_time_days: 2,
    is_active: true,
    total_orders: 32,
    total_value: 28450.25,
  },
  {
    id: "4",
    name: "Desechables del Caribe",
    contact_person: "Ana Lopez",
    email: "ana@desechables.com",
    phone: "+1-555-0104",
    address: "Zona Franca",
    city: "Ciudad",
    country: "País",
    currency: "USD",
    payment_terms: 30,
    lead_time_days: 5,
    is_active: true,
    total_orders: 12,
    total_value: 15680.0,
  },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [form, setForm] = useState<Partial<Supplier>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const fetchSuppliers = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("suppliers").select("id, name, contact_person, email, phone, address, city, country, currency, payment_terms, lead_time_days, is_active")
    if (error) {
      setError(error.message)
      setSuppliers([])
    } else {
      setSuppliers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const openCreateModal = () => {
    setEditingSupplier(null)
    setForm({})
    setModalOpen(true)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setForm(supplier)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSupplier(null)
    setForm({})
    setFormError("")
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    if (editingSupplier) {
      // Update
      const { error } = await supabase.from("suppliers").update(form).eq("id", editingSupplier.id)
      if (error) setFormError(error.message)
    } else {
      // Create
      const { error } = await supabase.from("suppliers").insert([form])
      if (error) setFormError(error.message)
    }
    setFormLoading(false)
    if (!formError) {
      closeModal()
      fetchSuppliers()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return
    setLoading(true)
    const { error } = await supabase.from("suppliers").delete().eq("id", id)
    if (error) setError(error.message)
    fetchSuppliers()
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-600">Manage your restaurant suppliers and vendors</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.filter((s) => s.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">$215K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">#</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">86</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">⏱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Lead Time</p>
                <p className="text-2xl font-bold">4.3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Supplier Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading ? (
            <div className="text-center py-8">Loading suppliers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.contact_person}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{supplier.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{supplier.address}</div>
                        <div className="text-gray-500">
                          {supplier.city}, {supplier.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Payment: {supplier.payment_terms} days</div>
                        <div className="text-gray-500">Lead: {supplier.lead_time_days} days</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{supplier.total_orders} orders</div>
                        <div className="text-gray-500">${supplier.total_value.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? "outline" : "secondary"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(supplier.id)}>
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input id="contact_person" name="contact_person" value={form.contact_person || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={form.email || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={form.phone || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={form.address || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={form.city || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={form.country || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" value={form.currency || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Payment Terms (days)</Label>
              <Input id="payment_terms" name="payment_terms" type="number" value={form.payment_terms || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_time_days">Lead Time (days)</Label>
              <Input id="lead_time_days" name="lead_time_days" type="number" value={form.lead_time_days || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Is Active</Label>
              <Input id="is_active" name="is_active" type="checkbox" checked={!!form.is_active} onChange={handleFormChange} />
            </div>
            {formError && <div className="text-red-500 text-center">{formError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : editingSupplier ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
