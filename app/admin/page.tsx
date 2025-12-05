"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { mockDashboardStats, mockOrders, salesTrendData, orderStatusData, categoryStockData } from "@/lib/mock-data"

export default function DashboardPage() {
  const { userRole } = useAuth()

  if (userRole === "super_admin") return <SuperAdminDashboard />
  if (userRole === "procurement") return <ProcurementDashboard />
  if (userRole === "packing") return <PackingDashboard />
  if (userRole === "delivery") return <DeliveryDashboard />

  return <SuperAdminDashboard />
}

function SuperAdminDashboard() {
  const statCards = [
    {
      title: "Total Orders",
      value: mockDashboardStats.totalOrders.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Total Sales",
      value: `₹${(mockDashboardStats.totalSales / 100000).toFixed(1)}L`,
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Users",
      value: mockDashboardStats.totalUsers.toLocaleString(),
      change: "+5.7%",
      trend: "up",
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Inventory",
      value: mockDashboardStats.totalProducts.toLocaleString(),
      change: "+2.3%",
      trend: "up",
      icon: Package,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Delivery Status",
      value: mockDashboardStats.activeDeliveries.toLocaleString(),
      change: "+4.1%",
      trend: "up",
      icon: Truck,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <ProtectedRoute permission="view_dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete overview of your store</p>
          </div>
          <Badge variant="destructive">Super Admin</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/orders?status=pending">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{mockDashboardStats.pendingOrders}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products?filter=low-stock">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{mockDashboardStats.lowStockItems}</p>
                    <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function ProcurementDashboard() {
  return (
    <ProtectedRoute permission="view_dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Procurement Dashboard</h1>
            <p className="text-muted-foreground">Manage inventory and orders</p>
          </div>
          <Badge>Procurement</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold">{mockDashboardStats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/admin/products?filter=low-stock">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold">{mockDashboardStats.lowStockItems}</p>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders?status=pending">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{mockDashboardStats.pendingOrders}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Overview by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStockData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#8884d8" />
                  <Bar dataKey="lowStock" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

function PackingDashboard() {
  const handleStartPacking = (orderNumber: string) => {
    // In real app, update order status to processing
    toast.success(`Started packing for ${orderNumber}`)
  }

  return (
    <ProtectedRoute permission="view_dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Packing Dashboard</h1>
            <p className="text-muted-foreground">Orders ready for packing</p>
          </div>
          <Badge variant="secondary">Packing</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/orders?status=pending">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{mockDashboardStats.pendingOrders}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Packed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders to Pack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOrders.slice(0, 8).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                  </div>
                  <Button size="sm" onClick={() => handleStartPacking(order.orderNumber)}>
                    Start Packing
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

function DeliveryDashboard() {
  const [deliveryStatus, setDeliveryStatus] = useState<Record<string, boolean>>({})

  const handleStartDelivery = (orderId: string, orderNumber: string) => {
    setDeliveryStatus(prev => ({ ...prev, [orderId]: true }))
    toast.success(`Started delivery for ${orderNumber}`)
  }

  return (
    <ProtectedRoute permission="view_dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Orders for delivery</p>
          </div>
          <Badge variant="outline">Delivery</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Truck className="h-8 w-8 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold">{mockDashboardStats.activeDeliveries}</p>
                  <p className="text-sm text-muted-foreground">Active Deliveries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">32</p>
                  <p className="text-sm text-muted-foreground">Delivered Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.address}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleStartDelivery(order.id, order.orderNumber)}
                    variant={deliveryStatus[order.id] ? "secondary" : "default"}
                    disabled={deliveryStatus[order.id]}
                  >
                    {deliveryStatus[order.id] ? "On the Way" : "Start Delivery"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
