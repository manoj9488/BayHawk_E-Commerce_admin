"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DataTable } from "@/components/admin/data-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Eye,
  Edit,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  DollarSign,
  Download,
  Users,
  UserCheck,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  joinedAt: string
  lastOrderAt: string
}

const mockCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    address: "123, Gandhi Street, Chennai - 600001",
    totalOrders: 45,
    totalSpent: 12500,
    status: "active",
    joinedAt: "2023-06-15",
    lastOrderAt: "2024-01-15",
  },
  {
    id: "CUS-002",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    address: "456, Nehru Road, Chennai - 600002",
    totalOrders: 23,
    totalSpent: 8900,
    status: "active",
    joinedAt: "2023-08-20",
    lastOrderAt: "2024-01-14",
  },
  {
    id: "CUS-003",
    name: "Anand Pillai",
    email: "anand@email.com",
    phone: "+91 76543 21098",
    address: "789, MG Road, Chennai - 600003",
    totalOrders: 67,
    totalSpent: 24500,
    status: "active",
    joinedAt: "2023-03-10",
    lastOrderAt: "2024-01-15",
  },
  {
    id: "CUS-004",
    name: "Meena Devi",
    email: "meena@email.com",
    phone: "+91 65432 10987",
    address: "321, Anna Salai, Chennai - 600004",
    totalOrders: 12,
    totalSpent: 3200,
    status: "inactive",
    joinedAt: "2023-11-05",
    lastOrderAt: "2023-12-20",
  },
  {
    id: "CUS-005",
    name: "Karthik Rajan",
    email: "karthik@email.com",
    phone: "+91 54321 09876",
    address: "654, Mount Road, Chennai - 600005",
    totalOrders: 89,
    totalSpent: 35600,
    status: "active",
    joinedAt: "2023-01-15",
    lastOrderAt: "2024-01-15",
  },
]

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer })
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingCustomer) return
    setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c))
    setEditOpen(false)
    toast.success("Customer updated successfully!")
  }

  const handleDeactivate = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (!customer) return
    const newStatus = customer.status === "active" ? "inactive" : "active"
    setCustomers(customers.map(c => c.id === customerId ? { ...c, status: newStatus } : c))
    toast.success(`Customer ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
  }

  const columns = [
    {
      key: "customer",
      header: "Customer",
      cell: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/diverse-group.png?height=40&width=40&query=person ${customer.name}`} />
            <AvatarFallback>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (customer: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      cell: (customer: Customer) => (
        <div className="flex items-start gap-2 max-w-[200px]">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-sm truncate">{customer.address}</span>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      cell: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{customer.totalOrders}</span>
        </div>
      ),
    },
    {
      key: "spent",
      header: "Total Spent",
      cell: (customer: Customer) => (
        <span className="font-semibold text-success">₹{customer.totalSpent.toLocaleString()}</span>
      ),
    },
    {
      key: "lastOrder",
      header: "Last Order",
      cell: (customer: Customer) => (
        <span className="text-sm text-muted-foreground">{new Date(customer.lastOrderAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (customer: Customer) => (
        <Badge
          variant="outline"
          className={
            customer.status === "active"
              ? "bg-success/20 text-success border-success/30"
              : "bg-muted text-muted-foreground"
          }
        >
          {customer.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (customer: Customer) => (
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
                setSelectedCustomer(customer)
                setDetailsOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(customer.id)}>
              <UserMinus className="mr-2 h-4 w-4" />
              {customer.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const activeCustomers = mockCustomers.filter((c) => c.status === "active").length
  const totalSpent = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalOrders = mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">View and manage all customers</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Customers
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCustomers.length}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCustomers}</p>
              <p className="text-sm text-muted-foreground">Active Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <ShoppingCart className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <DollarSign className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(totalSpent / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={mockCustomers}
            columns={columns}
            searchPlaceholder="Search customers by name, email, phone, address..."
          />
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>View customer information and order history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/diverse-group.png?height=64&width=64&query=person ${selectedCustomer.name}`}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedCustomer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.id}</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedCustomer.status === "active"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
                <div className="mt-2">
                  <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${selectedCustomer.address}&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-2xl font-bold text-success">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span>{new Date(selectedCustomer.joinedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-transparent" variant="outline">
                  View Orders
                </Button>
                <Button className="flex-1">Edit Customer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
