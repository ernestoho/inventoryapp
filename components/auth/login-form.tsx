"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/lib/auth"
import { Loader2, Info } from "lucide-react"

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            {isDemoMode
              ? "Demo Mode - Use the credentials below"
              : "Enter your credentials to access the inventory system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={isDemoMode ? "admin@example.com" : "your@email.com"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isDemoMode ? "admin123" : "••••••••"}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          {isDemoMode && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">Demo Mode Active</p>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>
                      <strong>Email:</strong> admin@example.com
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => {
                      setEmail("admin@example.com")
                      setPassword("admin123")
                    }}
                  >
                    Fill Demo Credentials
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isDemoMode && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Production Mode</p>
                  <p className="text-sm text-gray-600">
                    Use your registered account credentials. If you don't have an account, contact your administrator.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
