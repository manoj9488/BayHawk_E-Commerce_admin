"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  userRole: UserRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null
    if (storedRole) {
      setUser({
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: storedRole,
        status: "active",
        createdAt: new Date().toISOString()
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      userRole: user?.role || null 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
