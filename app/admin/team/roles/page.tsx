"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Shield } from "lucide-react"
import { toast } from "sonner"

const permissions = [
  { id: "orders_view", label: "View Orders", category: "Orders" },
  { id: "orders_create", label: "Create Orders", category: "Orders" },
  { id: "orders_edit", label: "Edit Orders", category: "Orders" },
  { id: "orders_delete", label: "Delete Orders", category: "Orders" },
  { id: "products_view", label: "View Products", category: "Products" },
  { id: "products_manage", label: "Manage Products", category: "Products" },
  { id: "stock_view", label: "View Stock", category: "Stock" },
  { id: "stock_manage", label: "Manage Stock", category: "Stock" },
  { id: "team_view", label: "View Team", category: "Team" },
  { id: "team_manage", label: "Manage Team", category: "Team" },
  { id: "reports_view", label: "View Reports", category: "Reports" },
  { id: "reports_generate", label: "Generate Reports", category: "Reports" },
  { id: "settings_view", label: "View Settings", category: "Settings" },
  { id: "settings_manage", label: "Manage Settings", category: "Settings" },
]

export default function CustomRolesPage() {
  const [roles, setRoles] = useState([
    { id: "1", name: "Store Manager", permissions: ["orders_view", "orders_edit", "products_view", "stock_view"], isCustom: true },
    { id: "2", name: "Inventory Clerk", permissions: ["stock_view", "stock_manage", "products_view"], isCustom: true },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const handleCreateRole = () => {
    if (!roleName.trim()) {
      toast.error("Role name is required")
      return
    }
    if (selectedPermissions.length === 0) {
      toast.error("Select at least one permission")
      return
    }

    const newRole = {
      id: Date.now().toString(),
      name: roleName,
      permissions: selectedPermissions,
      isCustom: true,
    }
    setRoles([...roles, newRole])
    setDialogOpen(false)
    setRoleName("")
    setSelectedPermissions([])
    toast.success("Custom role created successfully")
  }

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id))
    toast.success("Role deleted successfully")
  }

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    )
  }

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {} as Record<string, typeof permissions>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Roles</h1>
          <p className="text-muted-foreground">Create and manage custom user roles with specific permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input
                  placeholder="e.g., Store Manager"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={perm.id}
                            checked={selectedPermissions.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                          />
                          <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={handleCreateRole} className="w-full">
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {permissions.find(p => p.id === perm)?.label}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isCustom ? "default" : "secondary"}>
                      {role.isCustom ? "Custom" : "System"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
