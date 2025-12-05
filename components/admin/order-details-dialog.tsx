"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/lib/types"
import { User, Phone, Mail, MapPin, Package, Truck, CreditCard, Clock, Building, History } from "lucide-react"

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus?: (orderId: string, status: Order["status"]) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange, onUpdateStatus }: OrderDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "">("")
  const [selectedAgent, setSelectedAgent] = useState<string>("")

  if (!order) return null

  const statusColors: Record<string, string> = {
    received: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-warning/20 text-warning border-warning/30",
    packed: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    out_for_delivery: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    delivered: "bg-success/20 text-success border-success/30",
    cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{order.orderNumber}</DialogTitle>
              <DialogDescription>Created on {new Date(order.createdAt).toLocaleString()}</DialogDescription>
            </div>
            <Badge className={statusColors[order.status]} variant="outline">
              {order.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="grid gap-3 p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{order.customer.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items
            </h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left py-2 px-4 text-sm font-medium">Item</th>
                    <th className="text-center py-2 px-4 text-sm font-medium">Qty</th>
                    <th className="text-right py-2 px-4 text-sm font-medium">Price</th>
                    <th className="text-right py-2 px-4 text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-border/50">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2 px-4 text-right">₹{item.price}</td>
                      <td className="py-2 px-4 text-right font-medium">₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-secondary/30">
                    <td colSpan={3} className="py-2 px-4 text-right font-semibold">
                      Total
                    </td>
                    <td className="py-2 px-4 text-right font-bold text-lg">₹{order.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery Info
              </h3>
              <div className="space-y-2 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Slot: {order.deliverySlot}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Hub: {order.hub}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Zone: {order.zone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Info
              </h3>
              <div className="space-y-2 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Method:</span>
                  <Badge variant="outline" className="capitalize">
                    {order.paymentMethod}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "paid"
                        ? "bg-success/20 text-success"
                        : order.paymentStatus === "failed"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Source:</span>
                  <Badge variant="outline" className="capitalize">
                    {order.source}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order History */}
          {order.history && order.history.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Order History
                </h3>
                <div className="space-y-3">
                  {order.history.map((entry, index) => (
                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {index < order.history!.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {entry.status.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                        )}
                        {entry.updatedBy && (
                          <p className="text-xs text-muted-foreground mt-1">By: {entry.updatedBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Update Status</label>
              <Select value={selectedStatus || order.status} onValueChange={(v) => setSelectedStatus(v as Order["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Assign Delivery Partner</label>
              <Select value={selectedAgent || order.assignedTo} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEL-001">Suresh Kumar</SelectItem>
                  <SelectItem value="DEL-002">Kavitha R</SelectItem>
                  <SelectItem value="DEL-003">Murugan S</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedStatus && onUpdateStatus) {
                onUpdateStatus(order.id, selectedStatus)
              }
              onOpenChange(false)
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
