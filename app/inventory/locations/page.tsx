"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Edit, Warehouse, Coffee, ChefHat } from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { supabase } from "@/lib/supabase"

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

  useEffect(() => {
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
    fetchLocations()
  }, [])

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
        <Button>
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
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
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
