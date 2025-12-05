"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/admin/data-table"
import type { Notification } from "@/lib/types"
import { Plus, Bell, Send, Clock, Users, Smartphone, Mail, MessageSquare, CheckCircle, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

const mockNotifications: (Notification & { recipients?: number })[] = [
  {
    id: "NOT-001",
    title: "Flash Sale Alert!",
    message: "Get 20% off on all vegetables today only. Use code FLASH20",
    type: "push",
    targetAudience: "all",
    sentAt: "2024-01-15T10:00:00Z",
    status: "sent",
    recipients: 8945,
  },
  {
    id: "NOT-002",
    title: "Order Delivered",
    message: "Your order has been delivered successfully",
    type: "in_app",
    targetAudience: "specific",
    sentAt: "2024-01-15T11:30:00Z",
    status: "sent",
    recipients: 1,
  },
  {
    id: "NOT-003",
    title: "Weekend Special",
    message: "Special offers on dairy products this weekend!",
    type: "push",
    targetAudience: "segment",
    status: "scheduled",
    scheduledFor: "2024-01-20T08:00:00Z",
  },
  {
    id: "NOT-004",
    title: "New Products Added",
    message: "Check out our new range of organic products",
    type: "email",
    targetAudience: "all",
    status: "draft",
  },
]

export default function NotificationsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingNotification, setDeletingNotification] = useState<(Notification & { recipients?: number }) | null>(null)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "push",
    targetAudience: "all",
    scheduledFor: "",
  })

  const handleSendNow = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in title and message")
      return
    }

    if (editingId) {
      // Update existing notification
      setNotifications(prev => prev.map(n => 
        n.id === editingId 
          ? {
              ...n,
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type as "push" | "in_app" | "email" | "sms",
              targetAudience: newNotification.targetAudience,
              status: "sent" as const,
              sentAt: new Date().toISOString(),
              recipients: newNotification.targetAudience === "all" ? 8945 : 100,
            }
          : n
      ))
      toast.success("Notification updated and sent successfully!")
    } else {
      // Create new notification
      const notification = {
        id: `NOT-${Date.now()}`,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type as "push" | "in_app" | "email" | "sms",
        targetAudience: newNotification.targetAudience,
        sentAt: new Date().toISOString(),
        status: "sent" as const,
        recipients: newNotification.targetAudience === "all" ? 8945 : 100,
      }
      setNotifications([notification, ...notifications])
      toast.success("Notification sent successfully to users!")
    }

    setNewNotification({ title: "", message: "", type: "push", targetAudience: "all", scheduledFor: "" })
    setEditingId(null)
    setCreateOpen(false)
  }

  const handleSaveDraft = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in title and message")
      return
    }

    if (editingId) {
      // Update existing notification
      setNotifications(prev => prev.map(n => 
        n.id === editingId 
          ? {
              ...n,
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type as "push" | "in_app" | "email" | "sms",
              targetAudience: newNotification.targetAudience,
              scheduledFor: newNotification.scheduledFor || undefined,
            }
          : n
      ))
      toast.success("Notification updated successfully!")
    } else {
      // Create new draft
      const notification = {
        id: `NOT-${Date.now()}`,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type as "push" | "in_app" | "email" | "sms",
        targetAudience: newNotification.targetAudience,
        status: "draft" as const,
        scheduledFor: newNotification.scheduledFor || undefined,
      }
      setNotifications([notification, ...notifications])
      toast.success("Notification saved as draft!")
    }

    setNewNotification({ title: "", message: "", type: "push", targetAudience: "all", scheduledFor: "" })
    setEditingId(null)
    setCreateOpen(false)
  }

  const handleSendDraft = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, status: "sent" as const, sentAt: new Date().toISOString(), recipients: 8945 }
        : n
    ))
    toast.success("Notification sent successfully to users!")
  }

  const handleDelete = (notification: Notification & { recipients?: number }) => {
    setDeletingNotification(notification)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!deletingNotification) return
    setNotifications(prev => prev.filter(n => n.id !== deletingNotification.id))
    setDeleteDialogOpen(false)
    setDeletingNotification(null)
    toast.success("Notification deleted successfully!")
  }

  const handleEdit = (notification: Notification) => {
    setEditingId(notification.id)
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      scheduledFor: notification.scheduledFor || "",
    })
    setCreateOpen(true)
  }

  const typeIcons: Record<string, React.ElementType> = {
    push: Smartphone,
    in_app: Bell,
    email: Mail,
    sms: MessageSquare,
  }

  const statusColors: Record<string, string> = {
    sent: "bg-success/20 text-success border-success/30",
    scheduled: "bg-warning/20 text-warning border-warning/30",
    draft: "bg-muted text-muted-foreground",
  }

  const columns = [
    {
      key: "notification",
      header: "Notification",
      cell: (notification: Notification & { recipients?: number }) => {
        const Icon = typeIcons[notification.type]
        return (
          <div className="flex items-start gap-3 max-w-md">
            <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (notification: Notification) => (
        <Badge variant="outline" className="capitalize">
          {notification.type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      cell: (notification: Notification & { recipients?: number }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm capitalize">{notification.targetAudience}</p>
            {notification.recipients && (
              <p className="text-xs text-muted-foreground">{notification.recipients.toLocaleString()} recipients</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "timing",
      header: "Timing",
      cell: (notification: Notification) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {notification.sentAt ? (
            <span>Sent {new Date(notification.sentAt).toLocaleString()}</span>
          ) : notification.scheduledFor ? (
            <span className="text-warning">Scheduled for {new Date(notification.scheduledFor).toLocaleString()}</span>
          ) : (
            <span className="text-muted-foreground">Not scheduled</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (notification: Notification) => (
        <Badge variant="outline" className={statusColors[notification.status]}>
          {notification.status === "sent" && <CheckCircle className="h-3 w-3 mr-1" />}
          {notification.status === "scheduled" && <Clock className="h-3 w-3 mr-1" />}
          {notification.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (notification: Notification) => (
        <div className="flex items-center gap-1">
          {notification.status === "draft" && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleSendDraft(notification.id)}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(notification)}>
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          {notification.status === "scheduled" && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleEdit(notification)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleSendDraft(notification.id)}>
                <Send className="h-4 w-4" />
              </Button>
            </>
          )}
          {notification.status === "sent" && (
            <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
              <CheckCircle className="h-4 w-4 mr-1" />
              Sent
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(notification)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Send push notifications and messages to users</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Notification" : "Create Notification"}</DialogTitle>
              <DialogDescription>{editingId ? "Update notification details" : "Send a notification to users"}</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSendNow}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Notification title" 
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Enter your message..." 
                  rows={3} 
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newNotification.type} onValueChange={(v) => setNewNotification({ ...newNotification, type: v })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="in_app">In-App Message</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={newNotification.targetAudience} onValueChange={(v) => setNewNotification({ ...newNotification, targetAudience: v })}>
                    <SelectTrigger id="audience">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                      <SelectItem value="new">New Users</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Input 
                  id="schedule" 
                  type="datetime-local" 
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingNotification?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total Notifications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.filter((n) => n.status === "sent").length}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.filter((n) => n.status === "scheduled").length}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <Users className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">8.9K</p>
              <p className="text-sm text-muted-foreground">Total Reach</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable data={notifications} columns={columns} searchPlaceholder="Search notifications..." />
        </CardContent>
      </Card>
    </div>
  )
}
