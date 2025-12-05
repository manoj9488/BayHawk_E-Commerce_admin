"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/admin/data-table"
import { DeliveryHistoryDialog } from "@/components/admin/delivery-history-dialog"
import { useStore } from "@/lib/store"
import { mockHubs } from "@/lib/mock-data"
import { toast } from "sonner"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  UserMinus,
  Phone,
  Star,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Bike,
  Car,
  Download,
  ShieldCheck,
  ShieldX,
  History,
} from "lucide-react"

interface DeliveryAgent {
  id: string
  name: string
  phone: string
  email: string
  vehicleType: "bike" | "scooter" | "car"
  vehicleNumber: string
  verified: boolean
  status: "active" | "inactive" | "on_delivery"
  hub: string
  rating: number
  totalDeliveries: number
  todayDeliveries: number
  assignedOrders: number
  onTimeRate: number
}

const mockDeliveryAgents: DeliveryAgent[] = [
  {
    id: "DEL-001",
    name: "Suresh Kumar",
    phone: "+91 98765 43210",
    email: "suresh@delivery.com",
    vehicleType: "bike",
    vehicleNumber: "TN 01 AB 1234",
    verified: true,
    status: "on_delivery",
    hub: "Chennai Central",
    rating: 4.8,
    totalDeliveries: 1456,
    todayDeliveries: 12,
    assignedOrders: 3,
    onTimeRate: 95,
  },
  {
    id: "DEL-002",
    name: "Kavitha R",
    phone: "+91 87654 32109",
    email: "kavitha@delivery.com",
    vehicleType: "scooter",
    vehicleNumber: "TN 02 CD 5678",
    verified: true,
    status: "active",
    hub: "Chennai North",
    rating: 4.9,
    totalDeliveries: 1890,
    todayDeliveries: 15,
    assignedOrders: 2,
    onTimeRate: 98,
  },
  {
    id: "DEL-003",
    name: "Murugan S",
    phone: "+91 76543 21098",
    email: "murugan@delivery.com",
    vehicleType: "bike",
    vehicleNumber: "TN 03 EF 9012",
    verified: false,
    status: "inactive",
    hub: "Chennai South",
    rating: 4.5,
    totalDeliveries: 890,
    todayDeliveries: 0,
    assignedOrders: 0,
    onTimeRate: 88,
  },
  {
    id: "DEL-004",
    name: "Ramesh P",
    phone: "+91 65432 10987",
    email: "ramesh@delivery.com",
    vehicleType: "car",
    vehicleNumber: "TN 04 GH 3456",
    verified: true,
    status: "on_delivery",
    hub: "Chennai Central",
    rating: 4.7,
    totalDeliveries: 2340,
    todayDeliveries: 8,
    assignedOrders: 5,
    onTimeRate: 92,
  },
]

export default function DeliveryAgentsPage() {
  const [addAgentOpen, setAddAgentOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null)
  const { orders, deliveryAgents, updateDeliveryAgent } = useStore()

  const vehicleIcons: Record<string, React.ElementType> = {
    bike: Bike,
    scooter: Bike,
    car: Car,
  }

  const statusColors: Record<string, string> = {
    active: "bg-success/20 text-success border-success/30",
    inactive: "bg-muted text-muted-foreground",
    on_delivery: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  }

  const handleVerifyAgent = (agentId: string) => {
    updateDeliveryAgent(agentId, { verified: true })
    toast.success("Agent verified successfully!")
  }

  const handleToggleAgentStatus = (agent: DeliveryAgent) => {
    const newStatus = agent.status === "active" ? "inactive" : "active"
    updateDeliveryAgent(agent.id, { status: newStatus })
    toast.success(`Agent status updated to ${newStatus}`)
  }

  const handleRemoveAgent = (agentId: string) => {
    if (confirm("Are you sure you want to remove this agent? This action cannot be undone.")) {
      // In real app, call API to delete agent
      toast.success("Agent removed successfully!")
    }
  }

  const handleViewRatings = (agent: DeliveryAgent) => {
    setSelectedAgent(agent)
    setHistoryOpen(true)
  }

  const columns = [
    {
      key: "agent",
      header: "Delivery Agent",
      cell: (agent: DeliveryAgent) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/diverse-group.png?height=40&width=40&query=person ${agent.name}`} />
            <AvatarFallback>
              {agent.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{agent.name}</p>
              {agent.verified ? (
                <ShieldCheck className="h-4 w-4 text-success" />
              ) : (
                <ShieldX className="h-4 w-4 text-destructive" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{agent.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (agent: DeliveryAgent) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{agent.phone}</span>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      cell: (agent: DeliveryAgent) => {
        const Icon = vehicleIcons[agent.vehicleType]
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm capitalize">{agent.vehicleType}</p>
              <p className="text-xs text-muted-foreground">{agent.vehicleNumber}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "hub",
      header: "Hub",
      cell: (agent: DeliveryAgent) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{agent.hub}</span>
        </div>
      ),
    },
    {
      key: "performance",
      header: "Performance",
      cell: (agent: DeliveryAgent) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="font-medium">{agent.rating}</span>
            <span className="text-muted-foreground text-sm">({agent.totalDeliveries})</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={agent.onTimeRate} className="h-1.5 w-16" />
            <span className="text-xs text-muted-foreground">{agent.onTimeRate}% on-time</span>
          </div>
        </div>
      ),
    },
    {
      key: "today",
      header: "Today's Activity",
      cell: (agent: DeliveryAgent) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>{agent.todayDeliveries} delivered</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-warning" />
            <span>{agent.assignedOrders} pending</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (agent: DeliveryAgent) => (
        <Badge variant="outline" className={statusColors[agent.status]}>
          {agent.status.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (agent: DeliveryAgent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedAgent(agent)
                setHistoryOpen(true)
              }}
            >
              <History className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Truck className="mr-2 h-4 w-4" />
              Assign Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewRatings(agent)}>
              <Star className="mr-2 h-4 w-4" />
              View Ratings & Reviews
            </DropdownMenuItem>
            {!agent.verified && (
              <DropdownMenuItem className="text-success" onClick={() => handleVerifyAgent(agent.id)}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify Agent
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-warning" onClick={() => handleToggleAgentStatus(agent)}>
              <UserMinus className="mr-2 h-4 w-4" />
              {agent.status === 'active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveAgent(agent.id)}>
              <UserMinus className="mr-2 h-4 w-4" />
              Remove Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const activeAgents = mockDeliveryAgents.filter((a) => a.status !== "inactive").length
  const onDelivery = mockDeliveryAgents.filter((a) => a.status === "on_delivery").length
  const verified = mockDeliveryAgents.filter((a) => a.verified).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Agent Management</h1>
          <p className="text-muted-foreground">Manage and monitor delivery agents across all hubs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Delivery Agent</DialogTitle>
                <DialogDescription>Register a new delivery agent</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select>
                      <SelectTrigger id="vehicleType">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input id="vehicleNumber" placeholder="TN 01 AB 1234" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hub">Assigned Hub</Label>
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
                  <Button type="button" variant="outline" onClick={() => setAddAgentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Agent</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockDeliveryAgents.length}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAgents}</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <Clock className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{onDelivery}</p>
              <p className="text-sm text-muted-foreground">On Delivery</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <ShieldCheck className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{verified}</p>
              <p className="text-sm text-muted-foreground">Verified Agents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable data={mockDeliveryAgents} columns={columns} searchPlaceholder="Search delivery agents..." />
        </CardContent>
      </Card>
      <DeliveryHistoryDialog
        agent={selectedAgent}
        orders={orders.filter((order) => order.assignedTo === selectedAgent?.id)}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  )
}
