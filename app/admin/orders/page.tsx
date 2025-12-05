"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/data-table"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog"
import { CreateOrderDialog } from "@/components/admin/create-order-dialog"
import { AssignAgentDialog } from "@/components/admin/assign-agent-dialog"
import { useStore } from "@/lib/store"
import type { Order } from "@/lib/types"
import { Plus, MoreHorizontal, Eye, Edit, Truck, Printer, Calendar as CalendarIcon, Filter, X, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { sendOrderStatusNotification } from "@/lib/notifications"



export default function OrdersPage() {
  const { orders, hubs, deliverySlots, addOrder, updateOrder } = useStore()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [assignAgentOpen, setAssignAgentOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [hubFilter, setHubFilter] = useState<string>("all")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [deliverySlotFilter, setDeliverySlotFilter] = useState<string>("all")
  const [date, setDate] = useState<DateRange | undefined>()
  const [showFilters, setShowFilters] = useState(false)

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false
    if (sourceFilter !== "all" && order.source !== sourceFilter) return false
    if (hubFilter !== "all" && order.hub !== hubFilter) return false
    if (zoneFilter !== "all" && order.zone !== zoneFilter) return false
    if (paymentMethodFilter !== "all" && order.paymentMethod !== paymentMethodFilter) return false
    if (deliverySlotFilter !== "all" && order.deliverySlot !== deliverySlotFilter) return false
    if (date?.from && new Date(order.createdAt) < date.from) return false
    if (date?.to && new Date(order.createdAt) > date.to) return false
    return true
  })

  const statusCounts = {
    all: orders.length,
    received: orders.filter((o) => o.status === "received").length,
    processing: orders.filter((o) => o.status === "processing").length,
    packed: orders.filter((o) => o.status === "packed").length,
    out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  const statusColors: Record<string, string> = {
    received: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-warning/20 text-warning border-warning/30",
    packed: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    out_for_delivery: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    delivered: "bg-success/20 text-success border-success/30",
    cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  }

  const handleAddOrder = (newOrder: Order) => {
    addOrder(newOrder)
    toast.success("Order created successfully!")
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    
    const history = order.history || []
    history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: "Admin",
    })
    updateOrder(orderId, { status: newStatus, history })
    
    // Send notification to user
    sendOrderStatusNotification(order, newStatus)
    
    toast.success(`Order status updated and customer notified!`)
  }

  const handleAssignAgent = (orderId: string, agentId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    
    const history = order.history || []
    history.push({
      status: "out_for_delivery",
      timestamp: new Date().toISOString(),
      updatedBy: "Admin",
      note: `Assigned to agent ${agentId}`,
    })
    updateOrder(orderId, { status: "out_for_delivery", assignedTo: agentId, history })
    
    // Send notification to user
    sendOrderStatusNotification(order, "out_for_delivery")
    
    toast.success(`Order assigned and customer notified!`)
  }

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    const history = order?.history || []
    history.push({
      status: "cancelled",
      timestamp: new Date().toISOString(),
      updatedBy: "Admin",
      note: "Order cancelled by admin",
    })
    updateOrder(orderId, { status: "cancelled" as Order["status"], history })
    toast.success("Order cancelled")
  }

  const columns = [
    {
      key: "orderNumber",
      header: "Order ID",
      cell: (order: Order) => <span className="font-mono text-sm font-medium">{order.orderNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (order: Order) => (
        <div>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (order: Order) => (
        <Badge variant="outline" className="capitalize">
          {order.source}
        </Badge>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (order: Order) => <span className="text-muted-foreground">{order.items.length} items</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order: Order) => (
        <Badge className={statusColors[order.status]} variant="outline">
          {order.status.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      cell: (order: Order) => (
        <div>
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
          <p className="text-xs text-muted-foreground mt-1 capitalize">{order.paymentMethod}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      cell: (order: Order) => <span className="font-semibold">₹{order.total}</span>,
    },
    {
      key: "slot",
      header: "Delivery Slot",
      cell: (order: Order) => (
        <div>
          <p className="text-sm">{order.deliverySlot}</p>
          <p className="text-xs text-muted-foreground">{order.hub}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (order: Order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedOrder(order)
                setDetailsOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "processing")}>
              <Edit className="mr-2 h-4 w-4" />
              Mark Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "packed")}>
              <Truck className="mr-2 h-4 w-4" />
              Mark Packed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedOrder(order)
                setAssignAgentOpen(true)
              }}
            >
              <Truck className="mr-2 h-4 w-4" />
              Out for Delivery
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "delivered")}>
              <Printer className="mr-2 h-4 w-4" />
              Mark Delivered
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleCancelOrder(order.id)}>
              <X className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const clearFilters = () => {
    setStatusFilter("all")
    setSourceFilter("all")
    setHubFilter("all")
    setZoneFilter("all")
    setPaymentMethodFilter("all")
    setDeliverySlotFilter("all")
    setDate(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">View and manage all orders from multiple sources</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Orders ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="received" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Received ({statusCounts.received})
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
          >
            Processing ({statusCounts.processing})
          </TabsTrigger>
          <TabsTrigger value="packed" className="data-[state=active]:bg-chart-4 data-[state=active]:text-white">
            Packed ({statusCounts.packed})
          </TabsTrigger>
          <TabsTrigger
            value="out_for_delivery"
            className="data-[state=active]:bg-chart-1 data-[state=active]:text-primary-foreground"
          >
            Out for Delivery ({statusCounts.out_for_delivery})
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          >
            Delivered ({statusCounts.delivered})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>

            {showFilters && (
              <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                            ) : (
                            format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="web">Website</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={hubFilter} onValueChange={setHubFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Hub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hubs</SelectItem>
                    {hubs.map((hub) => (
                      <SelectItem key={hub.id} value={hub.name}>
                        {hub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {hubs.flatMap(hub => hub.zones).map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="cod">COD</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={deliverySlotFilter} onValueChange={setDeliverySlotFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Delivery Slot" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Slots</SelectItem>
                        {deliverySlots.map((slot) => (
                            <SelectItem key={slot.id} value={slot.name}>
                                {slot.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredOrders}
            columns={columns}
            searchPlaceholder="Search orders by ID, customer name, phone..."
            onExport={() => toast.success("Orders exported successfully!")}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdateStatus={handleUpdateStatus}
      />
      <CreateOrderDialog open={createOpen} onOpenChange={setCreateOpen} onCreateOrder={handleAddOrder} />
      <AssignAgentDialog
        order={selectedOrder}
        open={assignAgentOpen}
        onOpenChange={setAssignAgentOpen}
        onAssignAgent={handleAssignAgent}
      />
    </div>
  )
}
