"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { useStore } from "@/lib/store"
import type { Coupon } from "@/lib/types"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Tag,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
} from "lucide-react"
import { toast } from "sonner"

export default function MarketingPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore()
  const [addCouponOpen, setAddCouponOpen] = useState(false)

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
  })

  const activeCoupons = coupons.filter((c) => c.status === "active").length
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0)

  const statusColors: Record<string, string> = {
    active: "bg-success/20 text-success border-success/30",
    inactive: "bg-muted text-muted-foreground",
    expired: "bg-destructive/20 text-destructive border-destructive/30",
  }

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCoupon.code || !newCoupon.type || !newCoupon.value) {
      toast.error("Please fill in all required fields")
      return
    }

    const coupon: Coupon = {
      id: `CPN-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type as "percentage" | "fixed",
      value: Number(newCoupon.value),
      minOrderValue: Number(newCoupon.minOrderValue) || 0,
      maxDiscount: newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : undefined,
      validFrom: newCoupon.validFrom || new Date().toISOString().split("T")[0],
      validTo: newCoupon.validTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usageLimit: Number(newCoupon.usageLimit) || 100,
      usedCount: 0,
      status: "active",
    }

    addCoupon(coupon)
    toast.success(`Coupon "${coupon.code}" created successfully!`)
    setAddCouponOpen(false)
    setNewCoupon({
      code: "",
      type: "",
      value: "",
      minOrderValue: "",
      maxDiscount: "",
      validFrom: "",
      validTo: "",
      usageLimit: "",
    })
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Coupon code "${code}" copied to clipboard!`)
  }

  const handleDeleteCoupon = (coupon: Coupon) => {
    deleteCoupon(coupon.id)
    toast.success(`Coupon "${coupon.code}" deleted!`)
  }

  const handleToggleStatus = (coupon: Coupon) => {
    const newStatus = coupon.status === "active" ? "inactive" : "active"
    updateCoupon(coupon.id, { status: newStatus })
    toast.success(`Coupon "${coupon.code}" ${newStatus === "active" ? "activated" : "deactivated"}`)
  }

  const columns = [
    {
      key: "code",
      header: "Coupon Code",
      cell: (coupon: Coupon) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono font-bold">{coupon.code}</p>
            <p className="text-sm text-muted-foreground">{coupon.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      cell: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          {coupon.type === "percentage" ? (
            <Percent className="h-4 w-4 text-primary" />
          ) : (
            <DollarSign className="h-4 w-4 text-primary" />
          )}
          <div>
            <p className="font-semibold">{coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</p>
            {coupon.maxDiscount && <p className="text-xs text-muted-foreground">Max: ₹{coupon.maxDiscount}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "minOrder",
      header: "Min Order",
      cell: (coupon: Coupon) => <span className="text-sm">₹{coupon.minOrderValue}</span>,
    },
    {
      key: "validity",
      header: "Validity",
      cell: (coupon: Coupon) => (
        <div className="text-sm">
          <p>{new Date(coupon.validFrom).toLocaleDateString()}</p>
          <p className="text-muted-foreground">to {new Date(coupon.validTo).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      cell: (coupon: Coupon) => (
        <div>
          <p className="font-medium">
            {coupon.usedCount} / {coupon.usageLimit}
          </p>
          <div className="w-20 h-1.5 bg-secondary rounded-full mt-1">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (coupon: Coupon) => (
        <Badge variant="outline" className={statusColors[coupon.status]}>
          {coupon.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (coupon: Coupon) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopyCode(coupon.code)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(coupon)}>
              <Edit className="mr-2 h-4 w-4" />
              {coupon.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCoupon(coupon)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupon Management</h1>
          <p className="text-muted-foreground">Create and manage discount coupons and offers</p>
        </div>
        <Dialog open={addCouponOpen} onOpenChange={setAddCouponOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
              <DialogDescription>Create a new discount coupon</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddCoupon}>
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  placeholder="WELCOME20"
                  className="uppercase"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type *</Label>
                  <Select value={newCoupon.type} onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="20"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Min Order Value (₹)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    placeholder="500"
                    value={newCoupon.minOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="200"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={newCoupon.validTo}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="1000"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddCouponOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Coupon</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coupons.length}</p>
              <p className="text-sm text-muted-foreground">Total Coupons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Gift className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCoupons}</p>
              <p className="text-sm text-muted-foreground">Active Coupons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <Users className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUsage}</p>
              <p className="text-sm text-muted-foreground">Total Redemptions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(totalUsage * 50).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Savings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={coupons}
            columns={columns}
            searchPlaceholder="Search coupons..."
            onExport={() => toast.success("Coupons exported!")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
