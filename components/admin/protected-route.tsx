"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import { hasPermission, hasAnyPermission, Permission } from "@/lib/permissions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  permission, 
  permissions, 
  fallback 
}: ProtectedRouteProps) {
  const { userRole } = useAuth()

  if (!userRole) {
    return fallback || <UnauthorizedAccess />
  }

  const hasAccess = permission 
    ? hasPermission(userRole, permission)
    : permissions 
    ? hasAnyPermission(userRole, permissions)
    : true

  if (!hasAccess) {
    return fallback || <UnauthorizedAccess />
  }

  return <>{children}</>
}

function UnauthorizedAccess() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert className="max-w-md">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this section.
        </AlertDescription>
      </Alert>
    </div>
  )
}
