"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, ChefHat, Eye, Edit, Clock, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


interface Recipe {
  id: string
  name: string
  sales_item_name: string
  category: string
  serving_size: number
  preparation_time: number
  ingredients_count: number
  cost_per_serving: number
  selling_price: number
  margin: number
  is_active: boolean
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Cuba Libre Recipe",
    sales_item_name: "Cuba Libre",
    category: "bebidas",
    serving_size: 1,
    preparation_time: 3,
    ingredients_count: 4,
    cost_per_serving: 2.85,
    selling_price: 8.5,
    margin: 66.5,
    is_active: true,
  },
  {
    id: "2",
    name: "Mojito Recipe",
    sales_item_name: "Mojito",
    category: "bebidas",
    serving_size: 1,
    preparation_time: 5,
    ingredients_count: 6,
    cost_per_serving: 3.2,
    selling_price: 10.0,
    margin: 68.0,
    is_active: true,
  },
  {
    id: "3",
    name: "Vodka Tonic Recipe",
    sales_item_name: "Vodka Tonic",
    category: "bebidas",
    serving_size: 1,
    preparation_time: 2,
    ingredients_count: 3,
    cost_per_serving: 2.95,
    selling_price: 9.0,
    margin: 67.2,
    is_active: true,
  },
  {
    id: "4",
    name: "Piña Colada Recipe",
    sales_item_name: "Piña Colada",
    category: "bebidas",
    serving_size: 1,
    preparation_time: 4,
    ingredients_count: 5,
    cost_per_serving: 3.75,
    selling_price: 12.0,
    margin: 68.8,
    is_active: true,
  },
]

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [form, setForm] = useState<Partial<Recipe>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const fetchRecipes = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("recipes").select("id, name, sales_item_name, category, serving_size, preparation_time, ingredients_count, cost_per_serving, selling_price, margin, is_active")
    if (error) {
      setError(error.message)
      setRecipes([])
    } else {
      setRecipes(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const openCreateModal = () => {
    setEditingRecipe(null)
    setForm({})
    setModalOpen(true)
  }

  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setForm(recipe)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingRecipe(null)
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
    if (editingRecipe) {
      // Update
      const { error } = await supabase.from("recipes").update(form).eq("id", editingRecipe.id)
      if (error) setFormError(error.message)
    } else {
      // Create
      const { error } = await supabase.from("recipes").insert([form])
      if (error) setFormError(error.message)
    }
    setFormLoading(false)
    if (!formError) {
      closeModal()
      fetchRecipes()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return
    setLoading(true)
    const { error } = await supabase.from("recipes").delete().eq("id", id)
    if (error) setError(error.message)
    fetchRecipes()
  }

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.sales_item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "bebidas":
        return <Badge className="bg-blue-100 text-blue-800">Bebidas</Badge>
      case "comida":
        return <Badge className="bg-green-100 text-green-800">Comida</Badge>
      case "postres":
        return <Badge className="bg-purple-100 text-purple-800">Postres</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 70) return "text-green-600"
    if (margin >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-gray-600">Manage cocktail and food recipes with ingredient tracking</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Recipe
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recipes</p>
                <p className="text-2xl font-bold">{recipes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Prep Time</p>
                <p className="text-2xl font-bold">3.5 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">%</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Margin</p>
                <p className="text-2xl font-bold">67.6%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Cost</p>
                <p className="text-2xl font-bold">$3.19</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChefHat className="mr-2 h-5 w-5" />
            Recipe Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {loading ? (
            <div className="text-center py-8">Loading recipes...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Sales Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Prep Time</TableHead>
                  <TableHead>Ingredients</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      <div className="font-medium">{recipe.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{recipe.sales_item_name}</div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(recipe.category)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{recipe.preparation_time} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{recipe.ingredients_count} items</Badge>
                    </TableCell>
                    <TableCell>${recipe.cost_per_serving.toFixed(2)}</TableCell>
                    <TableCell>${recipe.selling_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getMarginColor(recipe.margin)}`}>
                        {recipe.margin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={recipe.is_active ? "outline" : "secondary"}>
                        {recipe.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(recipe)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe.id)}>
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
            <DialogTitle>{editingRecipe ? "Edit Recipe" : "New Recipe"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name || ""} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales_item_name">Sales Item Name</Label>
              <Input id="sales_item_name" name="sales_item_name" value={form.sales_item_name || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={form.category || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serving_size">Serving Size</Label>
              <Input id="serving_size" name="serving_size" type="number" value={form.serving_size || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preparation_time">Preparation Time (min)</Label>
              <Input id="preparation_time" name="preparation_time" type="number" value={form.preparation_time || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients_count">Ingredients Count</Label>
              <Input id="ingredients_count" name="ingredients_count" type="number" value={form.ingredients_count || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_per_serving">Cost per Serving</Label>
              <Input id="cost_per_serving" name="cost_per_serving" type="number" value={form.cost_per_serving || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price</Label>
              <Input id="selling_price" name="selling_price" type="number" value={form.selling_price || ""} onChange={handleFormChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Margin (%)</Label>
              <Input id="margin" name="margin" type="number" value={form.margin || ""} onChange={handleFormChange} />
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
                {formLoading ? "Saving..." : editingRecipe ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
