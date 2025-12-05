"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"
import type { Order } from "@/lib/types"

interface DeliveryHistoryDialogProps {
  agent: { name: string } | null
  orders: Order[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeliveryHistoryDialog({
  agent,
  orders,
  open,
  onOpenChange,
}: DeliveryHistoryDialogProps) {
  const mockReviews = [
    { id: "1", customer: "Rajesh Kumar", rating: 5, comment: "Excellent delivery! Very professional.", date: "2024-01-15" },
    { id: "2", customer: "Priya Sharma", rating: 4, comment: "Good service, delivered on time.", date: "2024-01-14" },
    { id: "3", customer: "Anand Pillai", rating: 5, comment: "Very polite and careful with products.", date: "2024-01-13" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Delivery Agent: {agent?.name}</DialogTitle>
          <DialogDescription>
            View delivery history, ratings and reviews
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Delivery History</TabsTrigger>
            <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4 max-h-[60vh] overflow-y-auto">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.total}</p>
                  <Badge>{order.status}</Badge>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="ratings" className="space-y-4 max-h-[60vh] overflow-y-auto">
            {mockReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{review.customer}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-warning text-warning" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
