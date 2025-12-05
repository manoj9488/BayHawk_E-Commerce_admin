"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockHubs } from "@/lib/mock-data"
import { Plus, Building, MapPin, MoreHorizontal, Edit, Trash2, Map, Users } from "lucide-react"
import { toast } from "sonner"

interface Hub {
  id: string
  name: string
  address: string
  zones: string[]
  status: "active" | "inactive"
}

export default function HubsPage() {
  const [addHubOpen, setAddHubOpen] = useState(false)
  const [hubs, setHubs] = useState<Hub[]>(mockHubs)
  const [newHub, setNewHub] = useState({
    name: "",
    address: "",
    zones: "",
    isActive: true,
  })

  const handleAddHub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHub.name || !newHub.address || !newHub.zones) {
      toast.error("Please fill all required fields")
      return
    }
    
    const hub: Hub = {
      id: Date.now().toString(),
      name: newHub.name,
      address: newHub.address,
      zones: newHub.zones.split(",").map(z => z.trim()).filter(z => z),
      status: newHub.isActive ? "active" : "inactive",
    }
    
    setHubs([...hubs, hub])
    setNewHub({ name: "", address: "", zones: "", isActive: true })
    setAddHubOpen(false)
    toast.success("Hub added successfully!")
  }

  const handleDeleteHub = (hubId: string) => {
    if (confirm("Are you sure you want to delete this hub?")) {
      setHubs(hubs.filter(h => h.id !== hubId))
      toast.success("Hub deleted successfully!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hubs & Zones</h1>
          <p className="text-muted-foreground">Manage delivery hubs and their service zones</p>
        </div>
        <Dialog open={addHubOpen} onOpenChange={setAddHubOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hub
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hub</DialogTitle>
              <DialogDescription>Create a new delivery hub</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddHub}>
              <div className="space-y-2">
                <Label htmlFor="hubName">Hub Name</Label>
                <Input 
                  id="hubName" 
                  placeholder="e.g., Chennai East" 
                  value={newHub.name}
                  onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hubAddress">Address</Label>
                <Textarea 
                  id="hubAddress" 
                  placeholder="Enter full address" 
                  rows={2} 
                  value={newHub.address}
                  onChange={(e) => setNewHub({ ...newHub, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zones">Service Zones (comma separated)</Label>
                <Input 
                  id="zones" 
                  placeholder="Zone A, Zone B, Zone C" 
                  value={newHub.zones}
                  onChange={(e) => setNewHub({ ...newHub, zones: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hubActive">Active Status</Label>
                <Switch 
                  id="hubActive" 
                  checked={newHub.isActive}
                  onCheckedChange={(checked) => setNewHub({ ...newHub, isActive: checked })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddHubOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Hub</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hubs.length}</p>
              <p className="text-sm text-muted-foreground">Total Hubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Map className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hubs.reduce((sum, h) => sum + h.zones.length, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Zones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <Users className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hubs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <Card key={hub.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{hub.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        hub.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                      }
                    >
                      {hub.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteHub(hub.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{hub.address}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Service Zones</p>
                <div className="flex flex-wrap gap-1">
                  {hub.zones.map((zone) => (
                    <Badge key={zone} variant="outline">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold">52</p>
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">145</p>
                  <p className="text-xs text-muted-foreground">Today's Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
