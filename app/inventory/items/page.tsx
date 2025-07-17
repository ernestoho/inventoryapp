"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Package, Edit, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Item {
  id: string
  sku: string
  name: string
  description: string
  category: string
  unit_of_measure: string
  cost_price: number
  selling_price: number
  reorder_point: number
  is_sales_item: boolean
  alcohol_content: number
  supplier_name: string
}

const mockItems: Item[] = [
  {
    id: "1",
    sku: "RUM-001",
    name: "Ron Blanco",
    description: "White rum 750ml bottle",
    category: "Bebidas Alcohólicas",
    unit_of_measure: "bottle",
    cost_price: 12.0,
    selling_price: 0.0,
    reorder_point: 10,
    is_sales_item: false,
    alcohol_content: 40.0,
    supplier_name: "Distribuidora de Licores SA",
  },
  {
    id: "2",
    sku: "BEER-001",
    name: "Cerveza Nacional",
    description: "Local beer 355ml bottle",
    category: "Bebidas Alcohólicas",
    unit_of_measure: "bottle",
    cost_price: 1.5,
    selling_price: 3.5,
    reorder_point: 50,
    is_sales_item: true,
    alcohol_content: 5.0,
    supplier_name: "Distribuidora de Licores SA",
  },
  {
    id: "3",
    sku: "COKE-001",
    name: "Coca-Cola",
    description: "Coca-Cola 2L bottle",
    category: "Bebidas No Alcohólicas",
    unit_of_measure: "bottle",
    cost_price: 2.0,
    selling_price: 0.0,
    reorder_point: 20,
    is_sales_item: false,
    alcohol_content: 0.0,
    supplier_name: "Refrescos y Bebidas Ltda",
  },
  {
    id: "4",
    sku: "LIME-001",
    name: "Limones",
    description: "Fresh limes",
    category: "Garnish",
    unit_of_measure: "kg",
    cost_price: 2.5,
    selling_price: 0.0,
    reorder_point: 5,
    is_sales_item: false,
    alcohol_content: 0.0,
    supplier_name: "Alimentos Frescos",
  },
  {
    id: "5",
    sku: "CUP-001",
    name: "Vasos Plásticos",
    description: "Plastic cups 16oz",
    category: "Desechables",
    unit_of_measure: "pcs",
    cost_price: 0.05,
    selling_price: 0.0,
    reorder_point: 500,
    is_sales_item: false,
    alcohol_content: 0.0,
    supplier_name: "Desechables del Caribe",
  },
]

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState<Partial<Item>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const fetchItems = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("items").select("id, sku, name, description, unit_of_measure, cost_price, selling_price, reorder_point, is_sales_item, alcohol_content")
    if (error) {
      setError(error.message)
      setItems([])
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({})
    setModalOpen(true)
  }

  const openEditModal = (item: Item) => {
    setEditingItem(item)
    setForm(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
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
    if (editingItem) {
      // Update
      const { error } = await supabase.from("items").update(form).eq("id", editingItem.id)
      if (error) setFormError(error.message)
    } else {
      // Create
      const { error } = await supabase.from("items").insert([form])
      if (error) setFormError(error.message)
    }
    setFormLoading(false)
    if (!formError) {
      closeModal()
      fetchItems()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return
    setLoading(true)
    const { error } = await supabase.from("items").delete().eq("id", id)
    if (error) setError(error.message)
    fetchItems()
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Items</h1>
          <p className="text-gray-600">Manage your restaurant inventory items</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Items Catalog
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.unit_of_measure}</TableCell>
                    <TableCell>${item.cost_price.toFixed(2)}</TableCell>
                    <TableCell>{item.reorder_point}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {item.is_sales_item && <Badge variant="secondary">Sales</Badge>}
                        {item.alcohol_content > 0 && <Badge variant="destructive">Alcohol</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={form.sku || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={form.description || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_of_measure">Unit of Measure</Label>
              <Input id="unit_of_measure" name="unit_of_measure" value={form.unit_of_measure || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input id="cost_price" name="cost_price" type="number" value={form.cost_price || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price</Label>
              <Input id="selling_price" name="selling_price" type="number" value={form.selling_price || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_point">Reorder Point</Label>
              <Input id="reorder_point" name="reorder_point" type="number" value={form.reorder_point || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_sales_item">Is Sales Item</Label>
              <Input id="is_sales_item" name="is_sales_item" type="checkbox" checked={!!form.is_sales_item} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alcohol_content">Alcohol Content</Label>
              <Input id="alcohol_content" name="alcohol_content" type="number" value={form.alcohol_content || ""} onChange={handleFormChange} />
            </div>
            {formError && <div className="text-red-500 text-center">{formError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
