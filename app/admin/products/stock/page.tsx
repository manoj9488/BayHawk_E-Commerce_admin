"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/data-table"
import { mockProducts, mockHubs } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import {
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Plus,
  RotateCcw,
  Download,
  Building,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  hub: string
  timestamp: string
  user: string
}

const mockStockMovements: StockMovement[] = [
  {
    id: "SM-001",
    productId: "p1",
    productName: "Fresh Tomatoes",
    type: "in",
    quantity: 50,
    reason: "Procurement",
    hub: "Chennai Central",
    timestamp: "2024-01-15T10:30:00Z",
    user: "Murugan S",
  },
  {
    id: "SM-002",
    productId: "p2",
    productName: "Onions",
    type: "out",
    quantity: 30,
    reason: "Order fulfillment",
    hub: "Chennai Central",
    timestamp: "2024-01-15T11:00:00Z",
    user: "System",
  },
  {
    id: "SM-003",
    productId: "p7",
    productName: "Coconut Oil",
    type: "adjustment",
    quantity: -5,
    reason: "Damaged goods",
    hub: "Chennai South",
    timestamp: "2024-01-15T09:15:00Z",
    user: "Lakshmi P",
  },
  {
    id: "SM-004",
    productId: "p3",
    productName: "Chicken Breast",
    type: "in",
    quantity: 100,
    reason: "Procurement",
    hub: "Chennai North",
    timestamp: "2024-01-15T08:00:00Z",
    user: "Murugan S",
  },
]

export default function StockManagementPage() {
  const [updateStockOpen, setUpdateStockOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")
  const [hubFilter, setHubFilter] = useState("all")

  const filteredProducts = mockProducts.filter((product) => {
    if (stockFilter === "low" && product.stock > product.lowStockThreshold) return false
    if (stockFilter === "out" && product.stock > 0) return false
    return true
  })

  const lowStockCount = mockProducts.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0).length
  const outOfStockCount = mockProducts.filter((p) => p.stock === 0).length
  const healthyStockCount = mockProducts.filter((p) => p.stock > p.lowStockThreshold).length

  const stockColumns = [
    {
      key: "product",
      header: "Product",
      cell: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (product: Product) => <Badge variant="outline">{product.category}</Badge>,
    },
    {
      key: "currentStock",
      header: "Current Stock",
      cell: (product: Product) => {
        const isLowStock = product.stock <= product.lowStockThreshold
        const isOutOfStock = product.stock === 0
        const stockPercentage = (product.stock / (product.lowStockThreshold * 3)) * 100
        return (
          <div className="space-y-2 min-w-[150px]">
            <div className="flex items-center justify-between">
              <span
                className={
                  isOutOfStock
                    ? "text-destructive font-semibold"
                    : isLowStock
                      ? "text-warning font-semibold"
                      : "font-semibold"
                }
              >
                {product.stock} {product.unit}
              </span>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">Low</Badge>
              ) : null}
            </div>
            <Progress
              value={Math.min(stockPercentage, 100)}
              className={`h-2 ${isOutOfStock ? "[&>div]:bg-destructive" : isLowStock ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`}
            />
          </div>
        )
      },
    },
    {
      key: "threshold",
      header: "Threshold",
      cell: (product: Product) => (
        <span className="text-muted-foreground">
          {product.lowStockThreshold} {product.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product: Product) => {
        const isLowStock = product.stock <= product.lowStockThreshold
        const isOutOfStock = product.stock === 0
        return (
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <>
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Critical</span>
              </>
            ) : isLowStock ? (
              <>
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-warning">Low Stock</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-success">Healthy</span>
              </>
            )}
          </div>
        )
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (product: Product) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedProduct(product)
              setUpdateStockOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Update
          </Button>
        </div>
      ),
    },
  ]

  const movementColumns = [
    {
      key: "product",
      header: "Product",
      cell: (movement: StockMovement) => (
        <div>
          <p className="font-medium">{movement.productName}</p>
          <p className="text-sm text-muted-foreground">{movement.productId}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (movement: StockMovement) => (
        <div className="flex items-center gap-2">
          {movement.type === "in" ? (
            <ArrowUpRight className="h-4 w-4 text-success" />
          ) : movement.type === "out" ? (
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          ) : (
            <RotateCcw className="h-4 w-4 text-warning" />
          )}
          <Badge
            variant="outline"
            className={
              movement.type === "in"
                ? "bg-success/20 text-success"
                : movement.type === "out"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-warning/20 text-warning"
            }
          >
            {movement.type === "in" ? "Stock In" : movement.type === "out" ? "Stock Out" : "Adjustment"}
          </Badge>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      cell: (movement: StockMovement) => (
        <span
          className={
            movement.type === "in" || (movement.type === "adjustment" && movement.quantity > 0)
              ? "text-success font-semibold"
              : "text-destructive font-semibold"
          }
        >
          {movement.type === "in" || (movement.type === "adjustment" && movement.quantity > 0) ? "+" : ""}
          {movement.quantity}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      cell: (movement: StockMovement) => <span className="text-muted-foreground">{movement.reason}</span>,
    },
    {
      key: "hub",
      header: "Hub",
      cell: (movement: StockMovement) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{movement.hub}</span>
        </div>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      cell: (movement: StockMovement) => (
        <div>
          <p className="text-sm">{new Date(movement.timestamp).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">{new Date(movement.timestamp).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "Updated By",
      cell: (movement: StockMovement) => <span className="text-sm">{movement.user}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Monitor and manage inventory levels across all hubs</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={hubFilter} onValueChange={setHubFilter}>
            <SelectTrigger className="w-[180px]">
              <Building className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Hub" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hubs</SelectItem>
              {mockHubs.map((hub) => (
                <SelectItem key={hub.id} value={hub.id}>
                  {hub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockProducts.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{healthyStockCount}</p>
              <p className="text-sm text-muted-foreground">Healthy Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          {/* Stock Filter */}
          <div className="flex gap-2">
            <Button
              variant={stockFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStockFilter("all")}
            >
              All Products
            </Button>
            <Button
              variant={stockFilter === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setStockFilter("low")}
              className={stockFilter === "low" ? "" : "text-warning border-warning/30"}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock ({lowStockCount})
            </Button>
            <Button
              variant={stockFilter === "out" ? "default" : "outline"}
              size="sm"
              onClick={() => setStockFilter("out")}
              className={stockFilter === "out" ? "" : "text-destructive border-destructive/30"}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Out of Stock ({outOfStockCount})
            </Button>
          </div>

          {/* Stock Table */}
          <Card>
            <CardContent className="p-6">
              <DataTable data={filteredProducts} columns={stockColumns} searchPlaceholder="Search products..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardContent className="p-6">
              <DataTable
                data={mockStockMovements}
                columns={movementColumns}
                searchPlaceholder="Search stock movements..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Stock Dialog */}
      <Dialog open={updateStockOpen} onOpenChange={setUpdateStockOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>{selectedProduct && `Update stock for ${selectedProduct.name}`}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <form className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Current Stock</span>
                  <span className="font-semibold">
                    {selectedProduct.stock} {selectedProduct.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Low Threshold</span>
                  <span>
                    {selectedProduct.lowStockThreshold} {selectedProduct.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateType">Update Type</Label>
                <Select>
                  <SelectTrigger id="updateType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock (Procurement)</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                    <SelectItem value="set">Set Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="damage">Damaged Goods</SelectItem>
                    <SelectItem value="expired">Expired Items</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="correction">Stock Correction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hub">Hub</Label>
                <Select>
                  <SelectTrigger id="hub">
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHubs.map((hub) => (
                      <SelectItem key={hub.id} value={hub.id}>
                        {hub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setUpdateStockOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Stock</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
