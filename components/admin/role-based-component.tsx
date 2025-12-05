"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import { hasPermission, hasAnyPermission, Permission } from "@/lib/permissions"

interface RoleBasedComponentProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  fallback?: React.ReactNode
}

export function RoleBasedComponent({ 
  children, 
  permission, 
  permissions, 
  fallback = null 
}: RoleBasedComponentProps) {
  const { userRole } = useAuth()

  if (!userRole) {
    return <>{fallback}</>
  }

  const hasAccess = permission 
    ? hasPermission(userRole, permission)
    : permissions 
    ? hasAnyPermission(userRole, permissions)
    : true

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
