"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RoleBasedComponent } from "@/components/admin/role-based-component"
import { useAuth } from "@/lib/auth-context"
import { ROLE_PERMISSIONS } from "@/lib/permissions"
import { Shield, Eye, Edit, Trash2, Plus, Settings, FileText } from "lucide-react"

export default function DemoPage() {
  const { user, userRole } = useAuth()

  if (!user || !userRole) {
    return <div>Loading...</div>
  }

  const userPermissions = ROLE_PERMISSIONS[userRole] || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role-Based Access Demo</h1>
          <p className="text-muted-foreground">
            This page demonstrates how different roles see different content and actions.
          </p>
        </div>
      </div>

      {/* Current Role Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Role: {user.role.replace('_', ' ').toUpperCase()}
          </CardTitle>
          <CardDescription>
            Your current permissions and what you can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {userPermissions.map((permission) => (
              <Badge key={permission} variant="secondary" className="text-xs">
                {permission.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Access */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Access</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleBasedComponent 
            permission="view_dashboard"
            fallback={<p className="text-muted-foreground">❌ No access to dashboard</p>}
          >
            <p className="text-green-600">✅ You can view the dashboard</p>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleBasedComponent 
            permission="view_orders"
            fallback={<p className="text-muted-foreground">❌ No access to orders</p>}
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-green-600">View Orders</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="edit_orders"
            fallback={<p className="text-muted-foreground">❌ Cannot edit orders</p>}
          >
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Edit Orders</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="delete_orders"
            fallback={<p className="text-muted-foreground">❌ Cannot delete orders</p>}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Delete Orders</span>
            </div>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card>
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleBasedComponent 
            permission="view_products"
            fallback={<p className="text-muted-foreground">❌ No access to products</p>}
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-green-600">View Products</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="edit_products"
            fallback={<p className="text-muted-foreground">❌ Cannot edit products</p>}
          >
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Edit Products</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="delete_products"
            fallback={<p className="text-muted-foreground">❌ Cannot delete products</p>}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Delete Products</span>
            </div>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleBasedComponent 
            permission="view_team"
            fallback={<p className="text-muted-foreground">❌ No access to team</p>}
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-green-600">View Team</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="edit_team"
            fallback={<p className="text-muted-foreground">❌ Cannot manage team</p>}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Add/Edit Team Members</span>
            </div>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Admin Only Features */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Only Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleBasedComponent 
            permission="view_settings"
            fallback={<p className="text-muted-foreground">❌ No access to settings</p>}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600">System Settings</span>
            </div>
          </RoleBasedComponent>

          <RoleBasedComponent 
            permission="view_audit"
            fallback={<p className="text-muted-foreground">❌ No access to audit logs</p>}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600">Audit Logs</span>
            </div>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <RoleBasedComponent permission="edit_orders">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
            </RoleBasedComponent>

            <RoleBasedComponent permission="edit_products">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </RoleBasedComponent>

            <RoleBasedComponent permission="edit_team">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </RoleBasedComponent>

            <RoleBasedComponent permission="generate_reports">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </RoleBasedComponent>

            <RoleBasedComponent permission="edit_settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </RoleBasedComponent>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
