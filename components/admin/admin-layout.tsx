"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Breadcrumb } from "./breadcrumb"
import { AuthProvider } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
        <div
          className={cn("flex min-h-screen flex-col transition-all duration-300", isCollapsed ? "lg:pl-16" : "lg:pl-64")}
        >
          <Header onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
