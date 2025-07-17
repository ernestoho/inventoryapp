"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Package, Edit, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"

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

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setItems(mockItems)
      setLoading(false)
    }, 1000)
  }, [])

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
        <Button>
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
    </div>
  )
}
