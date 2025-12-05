"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { toast } from "sonner"

const subscriptions = [
  { id: "1", name: "Basic Plan", price: 99, duration: "monthly", users: 45, status: "active" },
  { id: "2", name: "Premium Plan", price: 299, duration: "monthly", users: 23, status: "active" },
  { id: "3", name: "Annual Basic", price: 999, duration: "yearly", users: 12, status: "active" },
]

const userSubscriptions = [
  { id: "1", userName: "Rajesh Kumar", email: "rajesh@example.com", plan: "Premium Plan", startDate: "2024-12-01", endDate: "2025-01-01", status: "active" },
  { id: "2", userName: "Priya Sharma", email: "priya@example.com", plan: "Basic Plan", startDate: "2024-11-15", endDate: "2024-12-15", status: "active" },
  { id: "3", userName: "Amit Patel", email: "amit@example.com", plan: "Annual Basic", startDate: "2024-01-01", endDate: "2025-01-01", status: "active" },
]

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(subscriptions)
  const [subscribers, setSubscribers] = useState(userSubscriptions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [form, setForm] = useState({ name: '', price: 0, duration: 'monthly' })

  const handleCreate = () => {
    if (!form.name || form.price <= 0) {
      toast.error("Please fill all fields")
      return
    }
    const newPlan = {
      id: Date.now().toString(),
      name: form.name,
      price: form.price,
      duration: form.duration,
      users: 0,
      status: "active"
    }
    setPlans([...plans, newPlan])
    setForm({ name: '', price: 0, duration: 'monthly' })
    setDialogOpen(false)
    toast.success("Subscription plan created")
  }

  const handleEdit = () => {
    if (!editingPlan) return
    setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...editingPlan, name: form.name, price: form.price, duration: form.duration } : p))
    setEditingPlan(null)
    setForm({ name: '', price: 0, duration: 'monthly' })
    setDialogOpen(false)
    toast.success("Plan updated successfully")
  }

  const handleDelete = () => {
    if (!planToDelete) return
    setPlans(prev => prev.filter(p => p.id !== planToDelete))
    setDeleteDialogOpen(false)
    setPlanToDelete(null)
    toast.success("Plan deleted successfully")
  }

  const openEdit = (plan: any) => {
    setEditingPlan(plan)
    setForm({ name: plan.name, price: plan.price, duration: plan.duration })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage subscription plans and user subscriptions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingPlan(null)
            setForm({ name: '', price: 0, duration: 'monthly' })
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit' : 'Create'} Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input placeholder="e.g., Premium Plan" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" placeholder="299" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={form.duration} onValueChange={(v) => setForm({...form, duration: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={editingPlan ? handleEdit : handleCreate}>
                {editingPlan ? 'Update' : 'Create'} Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹14,250</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All plans active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+11%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>₹{plan.price}</TableCell>
                  <TableCell className="capitalize">{plan.duration}</TableCell>
                  <TableCell>{plan.users} users</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setPlanToDelete(plan.id)
                        setDeleteDialogOpen(true)
                      }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.userName}</TableCell>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{sub.plan}</TableCell>
                  <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(sub.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscription plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
