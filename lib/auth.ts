import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "manager" | "operator" | "viewer"
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

// Mock data for demo mode
const mockProfile: Profile = {
  id: "demo-user-id",
  email: "admin@example.com",
  full_name: "Demo Admin",
  role: "admin",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockUser: User = {
  id: "demo-user-id",
  email: "admin@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: { full_name: "Demo Admin" },
}

export async function getCurrentUser(): Promise<User | null> {
  if (isDemoMode) {
    return mockUser
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (isDemoMode) {
    return mockProfile
  }

  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

export async function signIn(email: string, password: string) {
  if (isDemoMode) {
    // Simulate successful login for demo
    if (email === "admin@example.com" && password === "admin123") {
      return {
        data: {
          user: mockUser,
          session: {
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: mockUser,
          },
        },
        error: null,
      }
    }
    return {
      data: { user: null, session: null },
      error: { message: "Invalid credentials. Use admin@example.com / admin123 for demo mode" },
    }
  }

  // Production mode - use real Supabase authentication
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string, fullName: string) {
  if (isDemoMode) {
    return { data: null, error: { message: "Sign up not available in demo mode" } }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (data.user && !error) {
    // Create profile
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      role: "viewer", // Default role
    })
  }

  return { data, error }
}

export async function signOut() {
  if (isDemoMode) {
    return { error: null }
  }

  return await supabase.auth.signOut()
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    viewer: 0,
    operator: 1,
    manager: 2,
    admin: 3,
  }

  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  )
}
