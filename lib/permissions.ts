import { UserRole } from "./types"

export type Permission = 
  | "view_dashboard"
  | "view_orders" | "edit_orders" | "delete_orders"
  | "view_products" | "edit_products" | "delete_products"
  | "view_team" | "edit_team" | "delete_team"
  | "view_reports" | "generate_reports"
  | "view_marketing" | "edit_marketing"
  | "view_settings" | "edit_settings"
  | "view_support" | "edit_support"
  | "view_audit"

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "view_dashboard", "view_orders", "edit_orders", "delete_orders",
    "view_products", "edit_products", "delete_products",
    "view_team", "edit_team", "delete_team",
    "view_reports", "generate_reports",
    "view_marketing", "edit_marketing",
    "view_settings", "edit_settings",
    "view_support", "edit_support",
    "view_audit"
  ],
  procurement: [
    "view_dashboard", "view_orders", "edit_orders",
    "view_products", "edit_products",
    "view_reports"
  ],
  packing: [
    "view_dashboard", "view_orders", "edit_orders",
    "view_products"
  ],
  delivery: [
    "view_dashboard", "view_orders", "edit_orders"
  ],
  custom: [] // Custom roles will have permissions assigned individually
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}
