"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { type Profile, getCurrentProfile } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, simulate logged in user
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

      const mockProfile: Profile = {
        id: "demo-user-id",
        email: "admin@example.com",
        full_name: "Demo Admin",
        role: "admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Set user as logged in immediately in demo mode
      setUser(mockUser)
      setProfile(mockProfile)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getCurrentProfile().then(setProfile)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const profile = await getCurrentProfile()
        setProfile(profile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (isDemoMode) {
      setUser(null)
      setProfile(null)
      return
    }

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
