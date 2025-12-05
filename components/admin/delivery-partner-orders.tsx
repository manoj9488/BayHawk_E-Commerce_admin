"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Order } from "@/lib/types"
import { sendOrderStatusNotification } from "@/lib/notifications"
import { MapPin, Phone, Package, Navigation, CheckCircle, Clock, Bell } from "lucide-react"
import { toast } from "sonner"

interface DeliveryPartnerOrdersProps {
  orders: Order[]
  partnerId: string
  onUpdateStatus: (orderId: string, status: Order["status"], note?: string) => void
}

export function DeliveryPartnerOrders({ orders, partnerId, onUpdateStatus }: DeliveryPartnerOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Order["status"]>("out_for_delivery")
  const [note, setNote] = useState("")

  const assignedOrders = orders.filter(
    (order) => order.assignedTo === partnerId && order.status !== "delivered" && order.status !== "cancelled"
  )

  const handleUpdateStatus = () => {
    if (!selectedOrder) return
    
    // Update order status
    onUpdateStatus(selectedOrder.id, newStatus, note)
    
    // Send notification to user
    sendOrderStatusNotification(selectedOrder, newStatus)
    
    setDetailsOpen(false)
    setNote("")
    toast.success("Status updated and customer notified!")
  }

  const handlePickup = (order: Order) => {
    onUpdateStatus(order.id, "out_for_delivery", "Order picked up by delivery partner")
    sendOrderStatusNotification(order, "out_for_delivery")
    toast.success("Order marked as picked up! Customer notified.")
  }

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assigned Deliveries ({assignedOrders.length})</h2>
      </div>

      {assignedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No deliveries assigned</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignedOrders.map((order) => (
            <Card key={order.id} className="hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Order Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.deliverySlot}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          order.status === "out_for_delivery"
                            ? "bg-chart-1/20 text-chart-1"
                            : "bg-warning/20 text-warning"
                        }
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{order.customer.name}</span>
                        <a href={`tel:${order.customer.phone}`} className="text-primary hover:underline">
                          {order.customer.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm flex-1">{order.customer.address}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{order.items.length} items</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-semibold">₹{order.total}</span>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="outline" className="capitalize">
                        {order.paymentMethod}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openGoogleMaps(order.customer.address)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                    {order.status === "packed" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-success hover:bg-success/90"
                        onClick={() => handlePickup(order)}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Pickup
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order)
                        setNewStatus(order.status)
                        setDetailsOpen(true)
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Order: {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Customer Info */}
            <div className="p-3 rounded-lg bg-secondary/30 space-y-2">
              <p className="font-medium">{selectedOrder?.customer.name}</p>
              <p className="text-sm text-muted-foreground">{selectedOrder?.customer.phone}</p>
              <p className="text-sm text-muted-foreground">{selectedOrder?.customer.address}</p>
            </div>

            {/* Status Select */}
            <div className="space-y-2">
              <Label>Delivery Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as Order["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="out_for_delivery">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Out for Delivery
                    </div>
                  </SelectItem>
                  <SelectItem value="delivered">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Delivered
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Textarea
                placeholder="Add delivery note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
