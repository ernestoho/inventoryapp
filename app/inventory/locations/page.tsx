"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Edit, Warehouse, Coffee, ChefHat, Trash2 } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Location {
  id: string
  name: string
  address: string
  city: string
  location_type: string
  is_active: boolean
  item_count: number
  total_value: number
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Amazon Bebidas",
    address: "Main Storage - Beverages",
    city: "Location",
    location_type: "storage",
    is_active: true,
    item_count: 156,
    total_value: 45680.5,
  },
  {
    id: "2",
    name: "Amazon Comida",
    address: "Main Storage - Food",
    city: "Location",
    location_type: "storage",
    is_active: true,
    item_count: 89,
    total_value: 12340.25,
  },
  {
    id: "3",
    name: "Amazon Desechables",
    address: "Main Storage - Disposables",
    city: "Location",
    location_type: "storage",
    is_active: true,
    item_count: 45,
    total_value: 3450.75,
  },
  {
    id: "4",
    name: "Bar Principal",
    address: "Main Bar Area",
    city: "Location",
    location_type: "bar",
    is_active: true,
    item_count: 67,
    total_value: 8920.3,
  },
  {
    id: "5",
    name: "Bar Terraza",
    address: "Terrace Bar",
    city: "Location",
    location_type: "bar",
    is_active: true,
    item_count: 45,
    total_value: 6780.15,
  },
  {
    id: "6",
    name: "Cocina Principal",
    address: "Main Kitchen",
    city: "Location",
    location_type: "kitchen",
    is_active: true,
    item_count: 78,
    total_value: 4560.8,
  },
  {
    id: "7",
    name: "Cocina Fría",
    address: "Cold Kitchen",
    city: "Location",
    location_type: "kitchen",
    is_active: true,
    item_count: 34,
    total_value: 2340.6,
  },
]

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [form, setForm] = useState<Partial<Location>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const fetchLocations = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("locations").select("id, name, address, city, location_type, is_active")
    if (error) {
      setError(error.message)
      setLocations([])
    } else {
      setLocations(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const openCreateModal = () => {
    setEditingLocation(null)
    setForm({})
    setModalOpen(true)
  }

  const openEditModal = (location: Location) => {
    setEditingLocation(location)
    setForm(location)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingLocation(null)
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
    if (editingLocation) {
      // Update
      const { error } = await supabase.from("locations").update(form).eq("id", editingLocation.id)
      if (error) setFormError(error.message)
    } else {
      // Create
      const { error } = await supabase.from("locations").insert([form])
      if (error) setFormError(error.message)
    }
    setFormLoading(false)
    if (!formError) {
      closeModal()
      fetchLocations()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return
    setLoading(true)
    const { error } = await supabase.from("locations").delete().eq("id", id)
    if (error) setError(error.message)
    fetchLocations()
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "storage":
        return <Warehouse className="h-5 w-5 text-blue-600" />
      case "bar":
        return <Coffee className="h-5 w-5 text-purple-600" />
      case "kitchen":
        return <ChefHat className="h-5 w-5 text-green-600" />
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />
    }
  }

  const getLocationBadge = (type: string) => {
    switch (type) {
      case "storage":
        return <Badge className="bg-blue-100 text-blue-800">Amazon Storage</Badge>
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
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-gray-600">Manage storage locations, bars, and kitchens</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {locations
          .filter((loc) => loc.location_type === "storage")
          .map((location) => (
            <Card key={location.id} className="border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(location.location_type)}
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                  {getLocationBadge(location.location_type)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <div className="flex justify-between text-sm">
                    <span>Items:</span>
                    <span className="font-medium">{location.item_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Value:</span>
                    <span className="font-medium">${location.total_value.toLocaleString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent" onClick={() => openEditModal(location)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Operational Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading locations...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations
                  .filter((loc) => loc.location_type !== "storage")
                  .map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getLocationIcon(location.location_type)}
                          <span className="font-medium">{location.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getLocationBadge(location.location_type)}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>{location.item_count}</TableCell>
                      <TableCell>${location.total_value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={location.is_active ? "outline" : "secondary"}>
                          {location.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(location)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            <DialogTitle>{editingLocation ? "Edit Location" : "Add Location"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name || ""} onChange={handleFormChange} required />
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
              <Label htmlFor="location_type">Location Type</Label>
              <Input id="location_type" name="location_type" value={form.location_type || ""} onChange={handleFormChange} required />
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
                {formLoading ? "Saving..." : editingLocation ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
