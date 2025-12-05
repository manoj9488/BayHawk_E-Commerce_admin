"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Package, AlertTriangle, CheckCircle, Truck, ShoppingCart } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: "1",
      type: "order",
      title: "New order received",
      message: "Order #ORD-2024-006 from Rajesh Kumar",
      timestamp: "2 min ago",
      read: false,
      icon: ShoppingCart,
    },
    {
      id: "2",
      type: "alert",
      title: "Low stock alert",
      message: "Coconut Oil is running low (5 units remaining)",
      timestamp: "15 min ago",
      read: false,
      icon: AlertTriangle,
    },
    {
      id: "3",
      type: "delivery",
      title: "Delivery completed",
      message: "Order #ORD-2024-005 delivered successfully",
      timestamp: "1 hour ago",
      read: true,
      icon: CheckCircle,
    },
    {
      id: "4",
      type: "order",
      title: "Order packed",
      message: "Order #ORD-2024-004 is ready for delivery",
      timestamp: "2 hours ago",
      read: true,
      icon: Package,
    },
    {
      id: "5",
      type: "delivery",
      title: "Out for delivery",
      message: "Order #ORD-2024-003 is out for delivery",
      timestamp: "3 hours ago",
      read: true,
      icon: Truck,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon
          return (
            <Card
              key={notification.id}
              className={`hover:border-primary transition-colors ${
                !notification.read ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-lg h-fit ${
                      notification.type === "order"
                        ? "bg-chart-1/10"
                        : notification.type === "alert"
                          ? "bg-destructive/10"
                          : "bg-success/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        notification.type === "order"
                          ? "text-chart-1"
                          : notification.type === "alert"
                            ? "text-destructive"
                            : "text-success"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                      </div>
                      {!notification.read && (
                        <Badge variant="default" className="shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
