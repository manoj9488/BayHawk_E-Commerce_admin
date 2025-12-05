"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoleBasedComponent } from "./role-based-component"
import { Permission } from "@/lib/permissions"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  MessageSquare,
  History,
  Shield,
} from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  icon: any
  permission?: Permission
  children?: { name: string; href: string; permission?: Permission }[]
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    permission: "view_dashboard",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: "view_orders",
  },
  {
    name: "Team & Users",
    href: "/admin/team",
    icon: Users,
    permission: "view_team",
    children: [
      { name: "Team Members", href: "/admin/team", permission: "view_team" },
      { name: "Admin Management", href: "/admin/team/admin-management", permission: "edit_team" },
      { name: "Customers", href: "/admin/team/customers", permission: "view_team" },
      { name: "Delivery Agents", href: "/admin/team/delivery", permission: "view_team" },
      { name: "Performance", href: "/admin/team/performance", permission: "view_team" },
      { name: "Custom Roles", href: "/admin/team/roles", permission: "edit_team" },
    ],
  },
  {
    name: "Products & Stock",
    href: "/admin/products",
    icon: Package,
    permission: "view_products",
    children: [
      { name: "All Products", href: "/admin/products", permission: "view_products" },
      { name: "Stock Management", href: "/admin/products/stock", permission: "edit_products" },
      { name: "Categories", href: "/admin/products/categories", permission: "edit_products" },
    ],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
    permission: "view_reports",
    children: [
      { name: "All Reports", href: "/admin/reports", permission: "view_reports" },
      { name: "Cutting Type", href: "/admin/reports/cutting-type", permission: "view_reports" },
    ],
  },
  {
    name: "Marketing",
    href: "/admin/marketing",
    icon: Megaphone,
    permission: "view_marketing",
    children: [
      { name: "Coupons", href: "/admin/marketing", permission: "view_marketing" },
      { name: "Notifications", href: "/admin/marketing/notifications", permission: "edit_marketing" },
      { name: "Rewards", href: "/admin/marketing/rewards", permission: "edit_marketing" },
      { name: "Subscriptions", href: "/admin/marketing/subscriptions", permission: "edit_marketing" },
      { name: "In-App Currency", href: "/admin/marketing/currency", permission: "edit_marketing" },
    ],
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: MessageSquare,
    permission: "view_support",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit",
    icon: History,
    permission: "view_audit",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: "view_settings",
    children: [
      { name: "General", href: "/admin/settings", permission: "view_settings" },
      { name: "Delivery Slots", href: "/admin/settings/delivery-slots", permission: "edit_settings" },
      { name: "Hubs & Zones", href: "/admin/settings/hubs", permission: "edit_settings" },
      { name: "Integrations", href: "/admin/settings/integrations", permission: "edit_settings" },
      { name: "Releases", href: "/admin/settings/releases", permission: "edit_settings" },
    ],
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
  }

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onMobileClose}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <RoleBasedComponent key={item.name} permission={item.permission}>
                <div>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.name}</span>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform",
                                expandedItems.includes(item.name) && "rotate-90",
                              )}
                            />
                          </>
                        )}
                      </button>
                      {!isCollapsed && expandedItems.includes(item.name) && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                          {item.children.map((child) => (
                            <RoleBasedComponent key={child.href} permission={child.permission}>
                              <Link
                                href={child.href}
                                onClick={onMobileClose}
                                className={cn(
                                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                                  pathname === child.href
                                    ? "bg-sidebar-accent text-sidebar-primary"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                )}
                              >
                                {child.name}
                              </Link>
                            </RoleBasedComponent>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  )}
                </div>
              </RoleBasedComponent>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link href="/" onClick={handleLogout}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed && "justify-center",
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </Link>
        </div>
      </aside>
    </>
  )
}
