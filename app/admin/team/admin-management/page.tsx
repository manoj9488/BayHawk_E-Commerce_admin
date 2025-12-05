"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleBasedComponent } from "@/components/admin/role-based-component"
import { useAuth } from "@/lib/auth-context"
import { Shield, UserPlus, Edit, Trash2 } from "lucide-react"

export default function AdminManagementPage() {
  const { user } = useAuth()

  const admins = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "super_admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "procurement" },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "packing" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", role: "delivery" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage admin users and their roles</p>
        </div>
        <RoleBasedComponent permission="edit_team">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </RoleBasedComponent>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Role</CardTitle>
          <CardDescription>You are logged in as</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <Badge variant="destructive">{user?.role}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>List of all admin users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                  <Badge className="mt-2">{admin.role}</Badge>
                </div>
                <div className="flex gap-2">
                  <RoleBasedComponent permission="edit_team">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </RoleBasedComponent>
                  <RoleBasedComponent permission="delete_team">
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </RoleBasedComponent>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>What each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Super Admin</h3>
              <p className="text-sm text-muted-foreground">Full access to all features</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Procurement</h3>
              <p className="text-sm text-muted-foreground">Can view/edit orders, products, and reports</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Packing</h3>
              <p className="text-sm text-muted-foreground">Can view/edit orders and view products</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-muted-foreground">Can view/edit orders only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
