"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, TrendingUp, Users, Gift, Plus, Search } from "lucide-react"
import { toast } from "sonner"

const transactions = [
  { id: "1", user: "Rajesh Kumar", type: "earned", amount: 50, reason: "Order completion", date: "2024-12-05" },
  { id: "2", user: "Priya Sharma", type: "redeemed", amount: -100, reason: "Discount applied", date: "2024-12-05" },
  { id: "3", user: "Arun Patel", type: "earned", amount: 25, reason: "Referral bonus", date: "2024-12-04" },
  { id: "4", user: "Lakshmi Reddy", type: "bonus", amount: 200, reason: "Admin credit", date: "2024-12-04" },
]

const allUsers = [
  { id: "user1", name: "Rajesh Kumar", email: "rajesh@example.com", phone: "9876543210" },
  { id: "user2", name: "Priya Sharma", email: "priya@example.com", phone: "9876543211" },
  { id: "user3", name: "Arun Patel", email: "arun@example.com", phone: "9876543212" },
  { id: "user4", name: "Lakshmi Reddy", email: "lakshmi@example.com", phone: "9876543213" },
  { id: "user5", name: "Vijay Kumar", email: "vijay@example.com", phone: "9876543214" },
  { id: "user6", name: "Anita Singh", email: "anita@example.com", phone: "9876543215" },
]

export default function InAppCurrencyPage() {
  const [txnList, setTxnList] = useState(transactions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [amount, setAmount] = useState("")
  const [reasonType, setReasonType] = useState("")
  const [customReason, setCustomReason] = useState("")

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  )

  const handleAddCredit = () => {
    if (!selectedUser || !amount || !reasonType) {
      toast.error("All fields are required")
      return
    }
    
    const user = allUsers.find(u => u.id === selectedUser)
    const userName = user?.name || ""
    const finalReason = reasonType === "other" ? customReason : reasonType
    
    const newTxn = {
      id: Date.now().toString(),
      user: userName,
      type: "bonus",
      amount: Number(amount),
      reason: finalReason,
      date: new Date().toISOString().split('T')[0]
    }
    
    setTxnList([newTxn, ...txnList])
    toast.success(`₹${amount} credits added to ${userName}'s wallet`)
    setDialogOpen(false)
    setSelectedUser("")
    setSearchQuery("")
    setAmount("")
    setReasonType("")
    setCustomReason("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">In-App Currency</h1>
          <p className="text-muted-foreground">Manage virtual currency and user credits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setSelectedUser("")
            setSearchQuery("")
            setAmount("")
            setReasonType("")
            setCustomReason("")
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credits to User Wallet</DialogTitle>
              <DialogDescription>Manually credit amount for payment issues, rewards errors, or compensation</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Search & Select User</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email or phone..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className={`p-3 cursor-pointer hover:bg-secondary ${selectedUser === user.id ? 'bg-secondary' : ''}`}
                          onClick={() => {
                            setSelectedUser(user.id)
                            setSearchQuery(user.name)
                          }}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email} • {user.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">No users found</div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={reasonType} onValueChange={setReasonType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payment issue - Amount deducted">Payment issue - Amount deducted</SelectItem>
                    <SelectItem value="Scratch card error - Reward not credited">Scratch card error - Reward not credited</SelectItem>
                    <SelectItem value="Spin wheel error - Reward not credited">Spin wheel error - Reward not credited</SelectItem>
                    <SelectItem value="Coupon not applied - Compensation">Coupon not applied - Compensation</SelectItem>
                    <SelectItem value="Order cancellation - Refund">Order cancellation - Refund</SelectItem>
                    <SelectItem value="Delivery delay - Compensation">Delivery delay - Compensation</SelectItem>
                    <SelectItem value="Product quality issue - Compensation">Product quality issue - Compensation</SelectItem>
                    <SelectItem value="Promotional bonus">Promotional bonus</SelectItem>
                    <SelectItem value="other">Other (Custom reason)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {reasonType === "other" && (
                <div className="space-y-2">
                  <Label>Custom Reason</Label>
                  <Textarea
                    placeholder="Enter custom reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleAddCredit} disabled={!selectedUser}>
                Add Credits to Wallet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Issued</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,250</div>
            <p className="text-xs text-muted-foreground">+2,340 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Credits Redeemed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,180</div>
            <p className="text-xs text-muted-foreground">71% redemption rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">With credit balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Balance</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Credits per user</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by user name..." className="pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txnList.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        txn.type === "earned"
                          ? "default"
                          : txn.type === "redeemed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={txn.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {txn.amount > 0 ? "+" : ""}{txn.amount}
                    </span>
                  </TableCell>
                  <TableCell>{txn.reason}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
