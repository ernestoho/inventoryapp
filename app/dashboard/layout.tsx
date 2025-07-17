"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  useEffect(() => {
    // In demo mode, user should always be authenticated
    if (isDemoMode) {
      return // Don't redirect in demo mode
    }

    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading && !isDemoMode) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user && !isDemoMode) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
