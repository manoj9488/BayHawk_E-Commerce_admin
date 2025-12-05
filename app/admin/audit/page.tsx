"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  History,
  Search,
  CalendarIcon,
  Download,
  RotateCcw,
  User,
  Package,
  ShoppingCart,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react"
import { format } from "date-fns"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function AuditPage() {
  const { auditLogs, restoreAuditLog } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [date, setDate] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "product":
        return <Package className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      case "team":
        return <User className="h-4 w-4" />
      case "coupon":
        return <Tag className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "order":
        return "bg-chart-1/10 text-chart-1 border-chart-1/30"
      case "product":
        return "bg-chart-2/10 text-chart-2 border-chart-2/30"
      case "user":
        return "bg-chart-4/10 text-chart-4 border-chart-4/30"
      case "settings":
        return "bg-warning/10 text-warning border-warning/30"
      case "team":
        return "bg-success/10 text-success border-success/30"
      case "coupon":
        return "bg-primary/10 text-primary border-primary/30"
      default:
        return ""
    }
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    const matchesDate = !date || (
      log.timestamp.toDateString() === date.toDateString()
    )
    return matchesSearch && matchesCategory && matchesDate
  })

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  const handleRestore = (logId: string, entityName: string) => {
    restoreAuditLog(logId)
    toast.success(`Successfully restored: ${entityName}`)
  }

  const handleExport = () => {
    toast.success("Audit logs exported successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Track all changes and actions across the system</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <History className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{auditLogs.length}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <ShoppingCart className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{auditLogs.filter((l) => l.category === "order").length}</p>
              <p className="text-sm text-muted-foreground">Order Changes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Package className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{auditLogs.filter((l) => l.category === "product").length}</p>
              <p className="text-sm text-muted-foreground">Product Updates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <RotateCcw className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{auditLogs.filter((l) => l.canRestore).length}</p>
              <p className="text-sm text-muted-foreground">Restorable Actions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="coupon">Coupons</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            {date && (
              <Button variant="ghost" size="icon" onClick={() => setDate(undefined)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Entity</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{log.action}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getCategoryColor(log.category)}>
                          <span className="mr-1">{getCategoryIcon(log.category)}</span>
                          {log.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{log.entityName}</p>
                          <p className="text-sm text-muted-foreground">{log.entityId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{log.user.name}</p>
                          <p className="text-sm text-muted-foreground">{log.user.role}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{log.timestamp.toLocaleTimeString()}</p>
                          <p className="text-sm text-muted-foreground">{log.timestamp.toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Audit Log Details</DialogTitle>
                                <DialogDescription>{log.action}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Entity</p>
                                    <p className="font-medium">{log.entityName}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Entity ID</p>
                                    <p className="font-mono">{log.entityId}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">User</p>
                                    <p className="font-medium">{log.user.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">IP Address</p>
                                    <p className="font-mono">{log.ipAddress}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-2">Changes</p>
                                  <div className="space-y-2">
                                    {log.changes.map((change, index) => (
                                      <div key={index} className="p-3 bg-secondary rounded-lg">
                                        <p className="text-sm font-medium capitalize">{change.field}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-sm text-destructive line-through">
                                            {change.oldValue}
                                          </span>
                                          <span className="text-muted-foreground">→</span>
                                          <span className="text-sm text-success">{change.newValue}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {log.canRestore && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-warning"
                              onClick={() => handleRestore(log.id, log.entityName)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
