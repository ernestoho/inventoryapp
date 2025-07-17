"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderOpen, Plus, Edit, Trash2, Wine, Coffee, Utensils, Package } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"

interface Category {
  id: string
  name: string
  description: string
  item_count: number
  icon: string
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Bebidas Alcohólicas",
    description: "Alcoholic beverages - rum, vodka, whiskey, etc.",
    item_count: 25,
    icon: "wine",
  },
  {
    id: "2",
    name: "Bebidas No Alcohólicas",
    description: "Non-alcoholic beverages - sodas, juices, water",
    item_count: 18,
    icon: "coffee",
  },
  {
    id: "3",
    name: "Comida",
    description: "Food ingredients and prepared items",
    item_count: 45,
    icon: "utensils",
  },
  {
    id: "4",
    name: "Desechables",
    description: "Disposable items - cups, napkins, straws",
    item_count: 12,
    icon: "package",
  },
  {
    id: "5",
    name: "Garnish",
    description: "Garnishes and mixers - lime, mint, olives",
    item_count: 8,
    icon: "utensils",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError("")
      const { data, error } = await supabase.from("categories").select("id, name, description")
      if (error) {
        setError(error.message)
        setCategories([])
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case "wine":
        return <Wine className="h-8 w-8 text-red-600" />
      case "coffee":
        return <Coffee className="h-8 w-8 text-blue-600" />
      case "utensils":
        return <Utensils className="h-8 w-8 text-green-600" />
      case "package":
        return <Package className="h-8 w-8 text-gray-600" />
      default:
        return <FolderOpen className="h-8 w-8 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Organize your inventory items by category</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {getCategoryIcon(category.icon)}
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {category.item_count} items
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Category Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Item Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(category.icon)}
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.item_count} items</Badge>
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
