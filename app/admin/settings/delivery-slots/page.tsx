"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Clock, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"

interface DeliverySlot {
  id: string
  name: string
  startTime: string
  endTime: string
  maxOrders: number
  currentOrders: number
  isActive: boolean
  days: string[]
}

const mockSlots: DeliverySlot[] = [
  {
    id: "1",
    name: "Early Morning",
    startTime: "06:00",
    endTime: "08:00",
    maxOrders: 50,
    currentOrders: 23,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "2",
    name: "Morning",
    startTime: "08:00",
    endTime: "10:00",
    maxOrders: 75,
    currentOrders: 45,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "3",
    name: "Late Morning",
    startTime: "10:00",
    endTime: "12:00",
    maxOrders: 100,
    currentOrders: 78,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "4",
    name: "Afternoon",
    startTime: "14:00",
    endTime: "16:00",
    maxOrders: 80,
    currentOrders: 52,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "5",
    name: "Evening",
    startTime: "16:00",
    endTime: "18:00",
    maxOrders: 90,
    currentOrders: 67,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "6",
    name: "Night",
    startTime: "18:00",
    endTime: "20:00",
    maxOrders: 60,
    currentOrders: 34,
    isActive: false,
    days: ["Fri", "Sat", "Sun"],
  },
]

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function DeliverySlotsPage() {
  const { deliverySlots } = useStore()
  const [addSlotOpen, setAddSlotOpen] = useState(false)
  const [editSlotOpen, setEditSlotOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(allDays)
  const [slots, setSlots] = useState<DeliverySlot[]>(deliverySlots)
  const [editingSlot, setEditingSlot] = useState<DeliverySlot | null>(null)
  const [deletingSlot, setDeletingSlot] = useState<DeliverySlot | null>(null)
  const [newSlot, setNewSlot] = useState({
    name: "",
    startTime: "",
    endTime: "",
    maxOrders: 50,
  })

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const toggleSlotActive = (slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
    ))
    const slot = slots.find(s => s.id === slotId)
    toast.success(`${slot?.name} ${slot?.isActive ? 'deactivated' : 'activated'}`)
  }

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlot.name || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill all required fields")
      return
    }
    const slot: DeliverySlot = {
      id: Date.now().toString(),
      name: newSlot.name,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      maxOrders: newSlot.maxOrders,
      currentOrders: 0,
      isActive: true,
      days: selectedDays,
    }
    setSlots([...slots, slot])
    setNewSlot({ name: "", startTime: "", endTime: "", maxOrders: 50 })
    setSelectedDays(allDays)
    setAddSlotOpen(false)
    toast.success("Delivery slot added successfully!")
  }

  const handleEditSlot = (slot: DeliverySlot) => {
    setEditingSlot(slot)
    setSelectedDays(slot.days)
    setEditSlotOpen(true)
  }

  const handleUpdateSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSlot) return
    setSlots(slots.map(s => s.id === editingSlot.id ? { ...editingSlot, days: selectedDays } : s))
    setEditSlotOpen(false)
    setEditingSlot(null)
    toast.success("Delivery slot updated successfully!")
  }

  const handleDeleteSlot = (slot: DeliverySlot) => {
    setDeletingSlot(slot)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!deletingSlot) return
    setSlots(slots.filter(s => s.id !== deletingSlot.id))
    setDeleteDialogOpen(false)
    setDeletingSlot(null)
    toast.success("Delivery slot deleted successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Slots</h1>
          <p className="text-muted-foreground">Configure delivery time slots and availability</p>
        </div>
        <Dialog open={addSlotOpen} onOpenChange={setAddSlotOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Delivery Slot</DialogTitle>
              <DialogDescription>Create a new delivery time slot</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddSlot}>
              <div className="space-y-2">
                <Label htmlFor="slotName">Slot Name</Label>
                <Input 
                  id="slotName" 
                  placeholder="e.g., Morning Slot" 
                  value={newSlot.name}
                  onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxOrders">Max Orders</Label>
                <Input 
                  id="maxOrders" 
                  type="number" 
                  placeholder="50" 
                  value={newSlot.maxOrders}
                  onChange={(e) => setNewSlot({ ...newSlot, maxOrders: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Available Days</Label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={selectedDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddSlotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Slot</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Slot Dialog */}
      <Dialog open={editSlotOpen} onOpenChange={setEditSlotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Delivery Slot</DialogTitle>
            <DialogDescription>Update delivery time slot details</DialogDescription>
          </DialogHeader>
          {editingSlot && (
            <form className="space-y-4" onSubmit={handleUpdateSlot}>
              <div className="space-y-2">
                <Label htmlFor="editSlotName">Slot Name</Label>
                <Input 
                  id="editSlotName" 
                  value={editingSlot.name}
                  onChange={(e) => setEditingSlot({ ...editingSlot, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartTime">Start Time</Label>
                  <Input 
                    id="editStartTime" 
                    type="time" 
                    value={editingSlot.startTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndTime">End Time</Label>
                  <Input 
                    id="editEndTime" 
                    type="time" 
                    value={editingSlot.endTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMaxOrders">Max Orders</Label>
                <Input 
                  id="editMaxOrders" 
                  type="number" 
                  value={editingSlot.maxOrders}
                  onChange={(e) => setEditingSlot({ ...editingSlot, maxOrders: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Available Days</Label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={selectedDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditSlotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Slot</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Delivery Slot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingSlot?.name}"? This action cannot be undone.
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

      {/* Slots Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`flex items-center gap-2 ${!slot.isActive ? "opacity-50" : ""}`}>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{slot.name}</CardTitle>
                    <CardDescription>
                      {slot.startTime} - {slot.endTime}
                    </CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={slot.isActive} 
                  onCheckedChange={() => toggleSlotActive(slot.id)}
                />
              </div>
            </CardHeader>
            <CardContent className={`space-y-4 ${!slot.isActive ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Orders</span>
                <span className="font-medium">
                  {slot.currentOrders} / {slot.maxOrders}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className={`h-full rounded-full ${
                    slot.currentOrders / slot.maxOrders > 0.8
                      ? "bg-destructive"
                      : slot.currentOrders / slot.maxOrders > 0.5
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                  style={{ width: `${(slot.currentOrders / slot.maxOrders) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {slot.days.map((day) => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditSlot(slot)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteSlot(slot)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
