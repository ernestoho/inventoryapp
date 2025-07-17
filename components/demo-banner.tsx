"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export function DemoBanner() {
  if (!isDemoMode) return null

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> This is a demonstration of the restaurant/bar inventory management system with mock
        data. Features include Amazon storage locations, traspasos (transfers), recipe-based sales, and
        mobile-responsive design. Login credentials: admin@example.com / admin123
      </AlertDescription>
    </Alert>
  )
}
