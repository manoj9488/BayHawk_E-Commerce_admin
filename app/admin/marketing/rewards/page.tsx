"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Gift, Star, Ticket, Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface SpinnerReward {
  id: string
  name: string
  type: "discount" | "cashback" | "freebie" | "points"
  value: number
  probability: number
  isActive: boolean
}

interface ScratchCard {
  id: string
  name: string
  minPurchase: number
  maxReward: number
  validFrom: Date
  validTo: Date
  isActive: boolean
  totalIssued: number
  totalRedeemed: number
}

const mockSpinnerRewards: SpinnerReward[] = [
  { id: "1", name: "10% Off", type: "discount", value: 10, probability: 30, isActive: true },
  { id: "2", name: "₹50 Cashback", type: "cashback", value: 50, probability: 20, isActive: true },
  { id: "3", name: "Free Delivery", type: "freebie", value: 0, probability: 25, isActive: true },
  { id: "4", name: "100 Points", type: "points", value: 100, probability: 15, isActive: true },
  { id: "5", name: "₹100 Off", type: "discount", value: 100, probability: 5, isActive: true },
  { id: "6", name: "Better Luck!", type: "freebie", value: 0, probability: 5, isActive: true },
]

const mockScratchCards: ScratchCard[] = [
  {
    id: "1",
    name: "Welcome Bonus",
    minPurchase: 0,
    maxReward: 100,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    totalIssued: 500,
    totalRedeemed: 320,
  },
  {
    id: "2",
    name: "Weekend Special",
    minPurchase: 500,
    maxReward: 200,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    totalIssued: 200,
    totalRedeemed: 89,
  },
  {
    id: "3",
    name: "Festival Offer",
    minPurchase: 1000,
    maxReward: 500,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: false,
    totalIssued: 100,
    totalRedeemed: 45,
  },
]

export default function RewardsPage() {
  const [spinnerRewards, setSpinnerRewards] = useState(mockSpinnerRewards)
  const [scratchCards, setScratchCards] = useState(mockScratchCards)
  const [spinnerEnabled, setSpinnerEnabled] = useState(true)
  const [scratchEnabled, setScratchEnabled] = useState(true)
  
  const [spinnerDialogOpen, setSpinnerDialogOpen] = useState(false)
  const [scratchDialogOpen, setScratchDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'spinner' | 'scratch', id: string } | null>(null)
  const [editingSpinner, setEditingSpinner] = useState<SpinnerReward | null>(null)
  const [editingScratch, setEditingScratch] = useState<ScratchCard | null>(null)
  
  const [spinnerForm, setSpinnerForm] = useState({ name: '', type: 'discount', value: 0, probability: 0 })
  const [scratchForm, setScratchForm] = useState({ name: '', minPurchase: 0, maxReward: 0, validFrom: '', validTo: '' })

  const totalProbability = spinnerRewards.filter((r) => r.isActive).reduce((sum, r) => sum + r.probability, 0)
  
  const handleAddSpinner = () => {
    if (!spinnerForm.name || spinnerForm.probability <= 0) {
      toast.error("Please fill all fields")
      return
    }
    const newReward: SpinnerReward = {
      id: Date.now().toString(),
      name: spinnerForm.name,
      type: spinnerForm.type as any,
      value: spinnerForm.value,
      probability: spinnerForm.probability,
      isActive: true
    }
    setSpinnerRewards([...spinnerRewards, newReward])
    setSpinnerForm({ name: '', type: 'discount', value: 0, probability: 0 })
    setSpinnerDialogOpen(false)
    toast.success("Reward added successfully")
  }
  
  const handleEditSpinner = () => {
    if (!editingSpinner) return
    setSpinnerRewards(prev => prev.map(r => r.id === editingSpinner.id ? { ...editingSpinner, ...spinnerForm } : r))
    setEditingSpinner(null)
    setSpinnerForm({ name: '', type: 'discount', value: 0, probability: 0 })
    setSpinnerDialogOpen(false)
    toast.success("Reward updated successfully")
  }
  
  const handleAddScratch = () => {
    if (!scratchForm.name || !scratchForm.validFrom || !scratchForm.validTo) {
      toast.error("Please fill all fields")
      return
    }
    const newCard: ScratchCard = {
      id: Date.now().toString(),
      name: scratchForm.name,
      minPurchase: scratchForm.minPurchase,
      maxReward: scratchForm.maxReward,
      validFrom: new Date(scratchForm.validFrom),
      validTo: new Date(scratchForm.validTo),
      isActive: true,
      totalIssued: 0,
      totalRedeemed: 0
    }
    setScratchCards([...scratchCards, newCard])
    setScratchForm({ name: '', minPurchase: 0, maxReward: 0, validFrom: '', validTo: '' })
    setScratchDialogOpen(false)
    toast.success("Campaign created successfully")
  }
  
  const handleEditScratch = () => {
    if (!editingScratch) return
    setScratchCards(prev => prev.map(c => c.id === editingScratch.id ? { 
      ...editingScratch, 
      name: scratchForm.name,
      minPurchase: scratchForm.minPurchase,
      maxReward: scratchForm.maxReward,
      validFrom: new Date(scratchForm.validFrom),
      validTo: new Date(scratchForm.validTo)
    } : c))
    setEditingScratch(null)
    setScratchForm({ name: '', minPurchase: 0, maxReward: 0, validFrom: '', validTo: '' })
    setScratchDialogOpen(false)
    toast.success("Campaign updated successfully")
  }
  
  const handleDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.type === 'spinner') {
      setSpinnerRewards(prev => prev.filter(r => r.id !== itemToDelete.id))
      toast.success("Reward deleted successfully")
    } else {
      setScratchCards(prev => prev.filter(c => c.id !== itemToDelete.id))
      toast.success("Campaign deleted successfully")
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }
  
  const openEditSpinner = (reward: SpinnerReward) => {
    setEditingSpinner(reward)
    setSpinnerForm({ name: reward.name, type: reward.type, value: reward.value, probability: reward.probability })
    setSpinnerDialogOpen(true)
  }
  
  const openEditScratch = (card: ScratchCard) => {
    setEditingScratch(card)
    setScratchForm({ 
      name: card.name, 
      minPurchase: card.minPurchase, 
      maxReward: card.maxReward,
      validFrom: card.validFrom.toISOString().split('T')[0],
      validTo: card.validTo.toISOString().split('T')[0]
    })
    setScratchDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards Management</h1>
          <p className="text-muted-foreground">Manage spinner wheel and scratch card rewards</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <RefreshCw className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-sm text-muted-foreground">Total Spins Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Ticket className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">456</p>
              <p className="text-sm text-muted-foreground">Cards Scratched</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Gift className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹12,500</p>
              <p className="text-sm text-muted-foreground">Rewards Given</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Star className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-muted-foreground">Redemption Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spinner">
        <TabsList>
          <TabsTrigger value="spinner">Spinner Wheel</TabsTrigger>
          <TabsTrigger value="scratch">Scratch Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="spinner" className="space-y-6">
          {/* Spinner Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Spinner Wheel Configuration
                  </CardTitle>
                  <CardDescription>Configure rewards for the spin-to-win wheel</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="spinnerEnabled">Enable Spinner</Label>
                    <Switch id="spinnerEnabled" checked={spinnerEnabled} onCheckedChange={setSpinnerEnabled} />
                  </div>
                  <Dialog open={spinnerDialogOpen} onOpenChange={(open) => {
                    setSpinnerDialogOpen(open)
                    if (!open) {
                      setEditingSpinner(null)
                      setSpinnerForm({ name: '', type: 'discount', value: 0, probability: 0 })
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Reward
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingSpinner ? 'Edit' : 'Add'} Spinner Reward</DialogTitle>
                        <DialogDescription>Configure a {editingSpinner ? 'reward' : 'new reward'} for the spinner wheel</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="rewardName">Reward Name</Label>
                          <Input id="rewardName" placeholder="e.g., 10% Off" value={spinnerForm.name} onChange={(e) => setSpinnerForm({...spinnerForm, name: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rewardType">Type</Label>
                          <Select value={spinnerForm.type} onValueChange={(v) => setSpinnerForm({...spinnerForm, type: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discount">Discount</SelectItem>
                              <SelectItem value="cashback">Cashback</SelectItem>
                              <SelectItem value="freebie">Freebie</SelectItem>
                              <SelectItem value="points">Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="value">Value</Label>
                            <Input id="value" type="number" placeholder="0" value={spinnerForm.value} onChange={(e) => setSpinnerForm({...spinnerForm, value: Number(e.target.value)})} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="probability">Probability (%)</Label>
                            <Input id="probability" type="number" placeholder="0" value={spinnerForm.probability} onChange={(e) => setSpinnerForm({...spinnerForm, probability: Number(e.target.value)})} />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingSpinner ? handleEditSpinner : handleAddSpinner}>{editingSpinner ? 'Update' : 'Add'} Reward</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {totalProbability !== 100 && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm">
                  Warning: Total probability is {totalProbability}%. It should equal 100%.
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reward</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Value</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Probability</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spinnerRewards.map((reward) => (
                      <tr key={reward.id} className="border-b border-border/50 hover:bg-secondary/50">
                        <td className="py-3 px-4 font-medium">{reward.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {reward.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {reward.type === "discount" && `${reward.value}%`}
                          {reward.type === "cashback" && `₹${reward.value}`}
                          {reward.type === "points" && `${reward.value} pts`}
                          {reward.type === "freebie" && "-"}
                        </td>
                        <td className="py-3 px-4">{reward.probability}%</td>
                        <td className="py-3 px-4">
                          <Switch
                            checked={reward.isActive}
                            onCheckedChange={(checked) =>
                              setSpinnerRewards((prev) =>
                                prev.map((r) => (r.id === reward.id ? { ...r, isActive: checked } : r)),
                              )
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditSpinner(reward)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                              setItemToDelete({ type: 'spinner', id: reward.id })
                              setDeleteDialogOpen(true)
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Visual Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Wheel Preview</CardTitle>
              <CardDescription>Visual representation of the spinner wheel</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {spinnerRewards
                    .filter((r) => r.isActive)
                    .map((reward, index, arr) => {
                      const total = arr.reduce((sum, r) => sum + r.probability, 0)
                      const startAngle = arr.slice(0, index).reduce((sum, r) => sum + (r.probability / total) * 360, 0)
                      const angle = (reward.probability / total) * 360
                      const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"]

                      const startRad = (startAngle * Math.PI) / 180
                      const endRad = ((startAngle + angle) * Math.PI) / 180
                      const x1 = 50 + 40 * Math.cos(startRad)
                      const y1 = 50 + 40 * Math.sin(startRad)
                      const x2 = 50 + 40 * Math.cos(endRad)
                      const y2 = 50 + 40 * Math.sin(endRad)
                      const largeArc = angle > 180 ? 1 : 0

                      return (
                        <path
                          key={reward.id}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={colors[index % colors.length]}
                          stroke="hsl(var(--background))"
                          strokeWidth="0.5"
                        />
                      )
                    })}
                  <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" />
                </svg>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scratch" className="space-y-6">
          {/* Scratch Card Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Scratch Card Campaigns
                  </CardTitle>
                  <CardDescription>Manage scratch card reward campaigns</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="scratchEnabled">Enable Scratch Cards</Label>
                    <Switch id="scratchEnabled" checked={scratchEnabled} onCheckedChange={setScratchEnabled} />
                  </div>
                  <Dialog open={scratchDialogOpen} onOpenChange={(open) => {
                    setScratchDialogOpen(open)
                    if (!open) {
                      setEditingScratch(null)
                      setScratchForm({ name: '', minPurchase: 0, maxReward: 0, validFrom: '', validTo: '' })
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingScratch ? 'Edit' : 'Create'} Scratch Card Campaign</DialogTitle>
                        <DialogDescription>Set up a {editingScratch ? 'scratch card reward campaign' : 'new scratch card reward campaign'}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="campaignName">Campaign Name</Label>
                          <Input id="campaignName" placeholder="e.g., Weekend Special" value={scratchForm.name} onChange={(e) => setScratchForm({...scratchForm, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="minPurchase">Min Purchase (₹)</Label>
                            <Input id="minPurchase" type="number" placeholder="0" value={scratchForm.minPurchase} onChange={(e) => setScratchForm({...scratchForm, minPurchase: Number(e.target.value)})} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="maxReward">Max Reward (₹)</Label>
                            <Input id="maxReward" type="number" placeholder="0" value={scratchForm.maxReward} onChange={(e) => setScratchForm({...scratchForm, maxReward: Number(e.target.value)})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="validFrom">Valid From</Label>
                            <Input id="validFrom" type="date" value={scratchForm.validFrom} onChange={(e) => setScratchForm({...scratchForm, validFrom: e.target.value})} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="validTo">Valid To</Label>
                            <Input id="validTo" type="date" value={scratchForm.validTo} onChange={(e) => setScratchForm({...scratchForm, validTo: e.target.value})} />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingScratch ? handleEditScratch : handleAddScratch}>{editingScratch ? 'Update' : 'Create'} Campaign</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scratchCards.map((card) => (
                  <Card key={card.id} className={!card.isActive ? "opacity-60" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                        <Switch
                          checked={card.isActive}
                          onCheckedChange={(checked) =>
                            setScratchCards((prev) =>
                              prev.map((c) => (c.id === card.id ? { ...c, isActive: checked } : c)),
                            )
                          }
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min Purchase</span>
                        <span className="font-medium">₹{card.minPurchase}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Reward</span>
                        <span className="font-medium">₹{card.maxReward}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valid Until</span>
                        <span className="font-medium">{card.validTo.toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Redemption</span>
                          <span className="font-medium">
                            {card.totalRedeemed}/{card.totalIssued}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(card.totalRedeemed / card.totalIssued) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => openEditScratch(card)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive bg-transparent" onClick={() => {
                          setItemToDelete({ type: 'scratch', id: card.id })
                          setDeleteDialogOpen(true)
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type === 'spinner' ? 'reward' : 'campaign'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
