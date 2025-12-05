"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { RoleBasedComponent } from "@/components/admin/role-based-component"
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/data-table"
import { useStore } from "@/lib/store"
import type { TeamMember } from "@/lib/types"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  UserMinus,
  Mail,
  Phone,
  Building,
  Users,
  Package,
  Truck,
  ShoppingBag,
  Star,
  TrendingUp,
  Download,
} from "lucide-react"
import { toast } from "sonner"

export default function TeamPage() {
  const { teamMembers, hubs, addTeamMember, updateTeamMember, deleteTeamMember } = useStore()
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    hub: "",
  })

  const filteredMembers = teamMembers.filter((member) => {
    if (selectedDepartment !== "all" && member.department !== selectedDepartment) return false
    return true
  })

  const departmentCounts = {
    all: teamMembers.length,
    packing: teamMembers.filter((m) => m.department === "packing").length,
    procurement: teamMembers.filter((m) => m.department === "procurement").length,
    delivery: teamMembers.filter((m) => m.department === "delivery").length,
    admin: teamMembers.filter((m) => m.department === "admin").length,
  }

  const departmentIcons: Record<string, React.ElementType> = {
    packing: Package,
    procurement: ShoppingBag,
    delivery: Truck,
    admin: Users,
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMember.name || !newMember.email || !newMember.department) {
      toast.error("Please fill in all required fields")
      return
    }

    const hubName = hubs.find((h) => h.id === newMember.hub)?.name || "Chennai Central"

    const member: TeamMember = {
      id: `TM-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "+91 00000 00000",
      role: newMember.role as TeamMember["role"],
      department: newMember.department as TeamMember["department"],
      status: "active",
      assignedOrders: 0,
      completedOrders: 0,
      hub: hubName,
      rating: newMember.department === "delivery" ? 5.0 : undefined,
    }

    addTeamMember(member)
    toast.success(`Team member "${member.name}" added successfully!`)
    setAddMemberOpen(false)
    setNewMember({ name: "", email: "", phone: "", department: "", role: "", hub: "" })
  }

  const handleDeactivateMember = (member: TeamMember) => {
    const newStatus = member.status === "active" ? "inactive" : "active"
    updateTeamMember(member.id, { status: newStatus })
    toast.success(`${member.name} ${newStatus === "active" ? "activated" : "deactivated"}`)
  }

  const columns = [
    {
      key: "member",
      header: "Team Member",
      cell: (member: TeamMember) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/diverse-group.png?height=40&width=40&query=person ${member.name}`} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (member: TeamMember) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{member.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (member: TeamMember) => {
        const Icon = departmentIcons[member.department] || Users
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="capitalize">
              {member.department}
            </Badge>
          </div>
        )
      },
    },
    {
      key: "hub",
      header: "Hub",
      cell: (member: TeamMember) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{member.hub}</span>
        </div>
      ),
    },
    {
      key: "performance",
      header: "Performance",
      cell: (member: TeamMember) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm">{member.completedOrders} completed</span>
          </div>
          {member.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-warning fill-warning" />
              <span className="text-sm font-medium">{member.rating}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (member: TeamMember) => (
        <Badge
          variant="outline"
          className={
            member.status === "active"
              ? "bg-success/20 text-success border-success/30"
              : "bg-muted text-muted-foreground"
          }
        >
          {member.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (member: TeamMember) => (
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
            <DropdownMenuItem>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Performance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivateMember(member)}>
              <UserMinus className="mr-2 h-4 w-4" />
              {member.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <ProtectedRoute permission="view_team">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage team members across all departments and hubs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <RoleBasedComponent permission="edit_team">
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a new team member to your organization</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddMember}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="packing">Packing</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="packing">Packing Staff</SelectItem>
                        <SelectItem value="procurement">Procurement Staff</SelectItem>
                        <SelectItem value="delivery">Delivery Agent</SelectItem>
                        <SelectItem value="custom">Custom Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hub">Assigned Hub</Label>
                  <Select value={newMember.hub} onValueChange={(value) => setNewMember({ ...newMember, hub: value })}>
                    <SelectTrigger id="hub">
                      <SelectValue placeholder="Select hub" />
                    </SelectTrigger>
                    <SelectContent>
                      {hubs.map((hub) => (
                        <SelectItem key={hub.id} value={hub.id}>
                          {hub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Member</Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </RoleBasedComponent>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(departmentCounts)
          .filter(([key]) => key !== "all")
          .map(([dept, count]) => {
            const Icon = departmentIcons[dept] || Users
            return (
              <Card key={dept}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{dept} Staff</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* Department Tabs */}
      <Tabs defaultValue="all" onValueChange={setSelectedDepartment}>
        <TabsList>
          <TabsTrigger value="all">All ({departmentCounts.all})</TabsTrigger>
          <TabsTrigger value="packing">Packing ({departmentCounts.packing})</TabsTrigger>
          <TabsTrigger value="procurement">Procurement ({departmentCounts.procurement})</TabsTrigger>
          <TabsTrigger value="delivery">Delivery ({departmentCounts.delivery})</TabsTrigger>
          <TabsTrigger value="admin">Admin ({departmentCounts.admin})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Team Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredMembers}
            columns={columns}
            searchPlaceholder="Search team members..."
            onExport={() => toast.success("Team data exported!")}
          />
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}
