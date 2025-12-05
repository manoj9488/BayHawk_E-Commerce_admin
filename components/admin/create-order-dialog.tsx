"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { mockProducts, mockHubs } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateOrder: (order: Order) => void
}

interface OrderItem {
  productId: string
  quantity: number
}

export function CreateOrderDialog({ open, onOpenChange, onCreateOrder }: CreateOrderDialogProps) {
  const [items, setItems] = useState<OrderItem[]>([{ productId: "", quantity: 1 }])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [source, setSource] = useState("")
  const [hub, setHub] = useState("")
  const [slot, setSlot] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = mockProducts.find((p) => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  const resetForm = () => {
    setItems([{ productId: "", quantity: 1 }])
    setCustomerName("")
    setCustomerPhone("")
    setCustomerEmail("")
    setCustomerAddress("")
    setSource("")
    setHub("")
    setSlot("")
    setPaymentMethod("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderItems = items
      .filter((item) => item.productId)
      .map((item, index) => {
        const product = mockProducts.find((p) => p.id === item.productId)
        return {
          id: `item-${Date.now()}-${index}`,
          productId: item.productId,
          name: product?.name || "",
          quantity: item.quantity,
          price: product?.price || 0,
          unit: product?.unit || "kg",
        }
      })

    const hubName = mockHubs.find((h) => h.id === hub)?.name || hub

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
      },
      items: orderItems,
      status: "received",
      source: source as Order["source"],
      paymentMethod: paymentMethod as Order["paymentMethod"],
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      total: calculateTotal(),
      deliverySlot: slot,
      hub: hubName,
      zone: "Zone A",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onCreateOrder(newOrder)
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Order</DialogTitle>
          <DialogDescription>Create a new order manually for customers from other sources</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Order Source</Label>
                <Select value={source} onValueChange={setSource} required>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="manual">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full delivery address"
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <Select value={item.productId} onValueChange={(value) => updateItem(index, "productId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ₹{product.price}/{product.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <p className="text-lg font-semibold">
                Total: <span className="text-primary">₹{calculateTotal()}</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div>
            <h3 className="font-semibold mb-3">Delivery Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hub">Hub</Label>
                <Select value={hub} onValueChange={setHub} required>
                  <SelectTrigger id="hub">
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHubs.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slot">Delivery Slot</Label>
                <Select value={slot} onValueChange={setSlot} required>
                  <SelectTrigger id="slot">
                    <SelectValue placeholder="Select slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</SelectItem>
                    <SelectItem value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</SelectItem>
                    <SelectItem value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
