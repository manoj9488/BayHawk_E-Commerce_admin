"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DeliveryPartnerOrders } from "@/components/admin/delivery-partner-orders"
import { useStore } from "@/lib/store"
import type { Order } from "@/lib/types"
import { Truck, CheckCircle, Clock, Package } from "lucide-react"
import { toast } from "sonner"

export default function DeliveryPartnerPage() {
  const { orders, updateOrder } = useStore()
  const [partnerId, setPartnerId] = useState("DEL-001") // In real app, get from auth

  const handleUpdateStatus = (orderId: string, status: Order["status"], note?: string) => {
    const order = orders.find((o) => o.id === orderId)
    const history = order?.history || []
    history.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy: partnerId,
      note: note || undefined,
    })
    updateOrder(orderId, { status, history })
  }

  const assignedOrders = orders.filter((o) => o.assignedTo === partnerId)
  const activeDeliveries = assignedOrders.filter(
    (o) => o.status === "out_for_delivery" || o.status === "packed"
  ).length
  const completedToday = assignedOrders.filter(
    (o) => o.status === "delivered" && new Date(o.updatedAt).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned deliveries</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Truck className="h-4 w-4 mr-2" />
          {partnerId}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-chart-1/10">
                <Truck className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeDeliveries}</p>
                <p className="text-sm text-muted-foreground">Active Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedToday}</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-chart-4/10">
                <Package className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignedOrders.length}</p>
                <p className="text-sm text-muted-foreground">Total Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Orders */}
      <DeliveryPartnerOrders orders={orders} partnerId={partnerId} onUpdateStatus={handleUpdateStatus} />
    </div>
  )
}
