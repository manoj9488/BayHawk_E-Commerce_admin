"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { CheckCircle, Clock, Package, Truck, ShoppingBag } from "lucide-react"

interface OrderTrackingProps {
  order: Order
}

const statusSteps = [
  { status: "received", label: "Order Received", icon: ShoppingBag },
  { status: "processing", label: "Processing", icon: Clock },
  { status: "packed", label: "Packed", icon: Package },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle },
]

export function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatusIndex = statusSteps.findIndex((step) => step.status === order.status)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Track Your Order</CardTitle>
          <Badge variant="outline">{order.orderNumber}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="relative">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex

              return (
                <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-0.5 h-16 ${
                        isCompleted ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "border-success bg-success text-white"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p
                      className={`font-medium ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-success mt-1">Current Status</p>
                    )}
                    {order.history && order.history.find((h) => h.status === step.status) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          order.history.find((h) => h.status === step.status)!.timestamp
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Delivery Info */}
          <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
            <p className="text-sm font-medium">Delivery Details</p>
            <p className="text-sm text-muted-foreground">
              Expected Delivery: <span className="font-medium text-foreground">{order.deliverySlot}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Delivery Address: <span className="font-medium text-foreground">{order.customer.address}</span>
            </p>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-sm font-medium mb-2">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold mt-3 pt-3 border-t">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
